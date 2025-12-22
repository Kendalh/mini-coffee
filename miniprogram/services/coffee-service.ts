import API_CONFIG from '../config/api-config';
import { CoffeeBeansResponse } from '../types/coffee';

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

/**
 * 获取咖啡豆数据
 * @param page 页码，默认为1
 * @param filters 过滤条件，包括国家、类型和风味分类
 * @returns Promise<CoffeeBeansResponse>
 */
export const getCoffeeBeans = async (page: number = 1, filters: { country?: string; type?: string; flavor_category?: string } = {}): Promise<CoffeeBeansResponse> => {
  return new Promise((resolve, reject) => {
    // 构建查询参数
    const data: any = {
      page: page,
      page_size: 10
    };
    
    // 添加过滤条件
    if (filters.country) {
      data.country = filters.country;
    }
    
    if (filters.type) {
      data.type = filters.type;
    }
    
    if (filters.flavor_category) {
      data.flavor_category = filters.flavor_category;
    }
    
    console.log('Making request to coffee-beans API with params:', data);
    
    wx.request({
      url: `${API_BASE_URL}/api/coffee-beans`,
      method: 'GET',
      data: data,
      success: (res: any) => {
        console.log('Coffee beans API response:', res);
        if (res.statusCode === 200) {
          resolve(res.data as CoffeeBeansResponse);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.errMsg}`));
        }
      },
      fail: (err: any) => {
        console.error('Coffee beans API request failed:', err);
        reject(new Error(`Network error: ${err.errMsg}`));
      }
    });
  });
};

/**
 * 获取所有风味分类列表
 * @returns Promise<string[]>
 */
export const getFlavorCategories = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    console.log('Making request to flavor categories API');
    
    wx.request({
      url: `${API_BASE_URL}/api/filters/flavor-categories`,
      method: 'GET',
      success: (res: any) => {
        console.log('Flavor categories API response:', res);
        if (res.statusCode === 200) {
          resolve(res.data as string[]);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.errMsg}`));
        }
      },
      fail: (err: any) => {
        console.error('Flavor categories API request failed:', err);
        reject(new Error(`Network error: ${err.errMsg}`));
      }
    });
  });
};

/**
 * 获取所有国家列表
 * @returns Promise<string[]>
 */
export const getCountries = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    console.log('Making request to countries API');
    
    wx.request({
      url: `${API_BASE_URL}/api/filters/countries`,
      method: 'GET',
      success: (res: any) => {
        console.log('Countries API response:', res);
        if (res.statusCode === 200) {
          resolve(res.data as string[]);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.errMsg}`));
        }
      },
      fail: (err: any) => {
        console.error('Countries API request failed:', err);
        reject(new Error(`Network error: ${err.errMsg}`));
      }
    });
  });
};