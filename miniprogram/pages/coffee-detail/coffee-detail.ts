import { CoffeeBean } from '../../types/coffee';
import API_CONFIG from '../../config/api-config';

// Determine the API base URL based on the environment
const getApiBaseUrl = (): string => {
  try {
    // In WeChat Mini Program, we can check the platform
    const systemInfo = wx.getSystemInfoSync();
    if (systemInfo.platform === 'devtools') {
      // Running in WeChat DevTools (computer preview)
      return `http://localhost:${API_CONFIG.PORT}`;
    } else {
      // Running on a real device
      // Use the configurable IP address
      return `http://${API_CONFIG.REAL_DEVICE_IP}:${API_CONFIG.PORT}`;
    }
  } catch (e) {
    // Fallback to localhost in case of any error
    return `http://localhost:${API_CONFIG.PORT}`;
  }
};

const API_BASE_URL = getApiBaseUrl();

Page({
  data: {
    coffeeBean: null as CoffeeBean | null,
    coffeeName: '',
    currentPrice: 0,
    loading: true,
    error: '',
    priceTrends: []
  },

  onLoad: function(options: any) {
    console.log('Coffee detail page loaded with options:', options);
    
    // Get the coffee bean data passed from the previous page
    const coffeeBeanJson = options.bean;
    if (coffeeBeanJson) {
      try {
        const coffeeBean = JSON.parse(decodeURIComponent(coffeeBeanJson));
        this.setData({
          coffeeBean: coffeeBean
        }, () => {
          // Load price trend data after setting the coffee bean
          this.loadPriceTrendData(coffeeBean.name);
        });
      } catch (e) {
        console.error('Failed to parse coffee bean data:', e);
        this.setData({
          error: '无法解析咖啡豆数据',
          loading: false
        });
      }
    } else {
      this.setData({
        error: '未提供咖啡豆数据',
        loading: false
      });
    }
  },

  loadPriceTrendData: function(beanName: string) {
    console.log('Loading price trend data for:', beanName);
    
    // Encode the bean name for URL
    const encodedBeanName = encodeURIComponent(beanName);
    const url = `${API_BASE_URL}/api/coffee-beans/${encodedBeanName}/price-trends`;
    
    console.log('Making request to price trends API:', url);
    
    wx.request({
      url: url,
      method: 'GET',
      success: (res: any) => {
        console.log('Price trends API response:', res);
        if (res.statusCode === 200) {
          this.processChartData(res.data);
        } else {
          console.error('Failed to load price trends:', res);
          this.setData({
            error: `获取价格趋势失败: ${res.statusCode}`,
            loading: false
          });
        }
      },
      fail: (err: any) => {
        console.error('Price trends API request failed:', err);
        this.setData({
          error: '网络错误，无法获取价格趋势',
          loading: false
        });
      }
    });
  },

  // 处理价格趋势数据
  processChartData: function(apiData: any[]) {
    if (!apiData || apiData.length === 0) {
      this.setData({
        loading: false
      });
      return;
    }

    // 过滤掉价格为空的数据点
    const filteredData = apiData.filter(item => 
      item.hasOwnProperty('data_month') && 
      item.hasOwnProperty('data_year') && 
      item.hasOwnProperty('price_per_kg') &&
      item.price_per_kg !== null && 
      typeof item.price_per_kg === 'number'
    );

    // 按时间排序（从新到旧，最新在前）
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.data_year, a.data_month - 1);
      const dateB = new Date(b.data_year, b.data_month - 1);
      return dateB.getTime() - dateA.getTime(); // 最新在前
    });

    this.setData({
      priceTrends: sortedData,
      loading: false
    });
  }


});