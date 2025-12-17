import { getCoffeeBeans, getCountries } from '../../services/coffee-service';
import { CoffeeBean, Pagination } from '../../types/coffee';

Component({
  data: {
    coffeeBeans: [] as CoffeeBean[],
    pagination: {} as Pagination,
    currentPage: 1,
    loading: false,
    selectedBean: null as CoffeeBean | null,
    showModal: false,
    countries: [] as string[],
    countryRange: ['全部'] as string[], // Full range for picker
    typeRange: ['全部', '商业豆', '精品豆'], // Full range for picker
    selectedCountry: '',
    selectedType: '',
    selectedCountryLabel: '',
    selectedTypeLabel: ''
  },
  lifetimes: {
    attached() {
      this.loadFilters();
      this.loadData();
    }
  },
  methods: {
    async loadFilters() {
      try {
        const countries = await getCountries();
        console.log('Loaded countries:', countries);
        console.log('Number of countries:', countries.length);
        
        // Create the full range for the picker
        const countryRange = ['全部'].concat(countries);
        console.log('Country range for picker:', countryRange);
        
        this.setData({
          countries: countries,
          countryRange: countryRange
        }, () => {
          console.log('Countries set in data:', this.data.countries);
          console.log('Country range set in data:', this.data.countryRange);
        });
      } catch (error) {
        console.error('Failed to load countries:', error);
        wx.showToast({
          title: '国家列表加载失败',
          icon: 'none'
        });
      }
    },
    
    async loadData() {
      const { currentPage, selectedCountry, selectedType } = this.data;
      console.log('Loading data with filters - Country:', selectedCountry, 'Type:', selectedType);
      this.setData({ loading: true });
      
      // 构建过滤条件
      const filters: { country?: string; type?: string } = {};
      if (selectedCountry) {
        filters.country = selectedCountry;
      }
      if (selectedType) {
        filters.type = selectedType;
      }
      
      try {
        const response = await getCoffeeBeans(currentPage, filters);
        console.log('Received coffee beans data:', response);
        this.setData({
          coffeeBeans: response.data,
          pagination: response.pagination,
          loading: false
        });
      } catch (error) {
        console.error('Failed to load coffee beans:', error);
        this.setData({ loading: false });
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    },
    
    onCountryChange(e: any) {
      console.log('Country change event:', e);
      const selectedIndex = e.detail.value;
      console.log('Selected country index from picker:', selectedIndex);
      
      // Get the actual value from the range array
      const selectedValue = this.data.countryRange[selectedIndex];
      console.log('Selected country value:', selectedValue);
      
      // Handle "全部" selection
      if (selectedValue === '全部') {
        this.setData({
          selectedCountry: '',
          selectedCountryLabel: '全部'
        }, () => {
          this.loadData();
        });
        return;
      }
      
      // Set both the actual value (for API) and display value
      this.setData({
        selectedCountry: selectedValue,
        selectedCountryLabel: selectedValue,
        currentPage: 1
      }, () => {
        console.log('Updated selected country in data:', this.data.selectedCountry);
        this.loadData();
      });
    },
    
    onTypeChange(e: any) {
      console.log('Type change event:', e);
      const selectedIndex = e.detail.value;
      console.log('Selected type index from picker:', selectedIndex);
      
      // Get the actual value from the range array
      const selectedValue = this.data.typeRange[selectedIndex];
      console.log('Selected type value:', selectedValue);
      
      // Handle "全部" selection
      if (selectedValue === '全部') {
        this.setData({
          selectedType: '',
          selectedTypeLabel: '全部'
        }, () => {
          this.loadData();
        });
        return;
      }
      
      // Convert UI labels to API values
      let apiValue = '';
      if (selectedValue === '商业豆') {
        apiValue = 'common';
      } else if (selectedValue === '精品豆') {
        apiValue = 'premium';
      }
      
      console.log('API value for type:', apiValue);
      
      // Set both the actual value (for API) and display value
      this.setData({
        selectedType: apiValue,
        selectedTypeLabel: selectedValue,
        currentPage: 1
      }, () => {
        console.log('Updated selected type in data:', this.data.selectedType);
        this.loadData();
      });
    },
    
    onNextPage() {
      const { pagination } = this.data;
      if (pagination.has_next) {
        this.setData({
          currentPage: pagination.page + 1
        }, () => {
          this.loadData();
        });
      }
    },
    
    onPrevPage() {
      const { pagination } = this.data;
      if (pagination.has_prev) {
        this.setData({
          currentPage: pagination.page - 1
        }, () => {
          this.loadData();
        });
      }
    },
    
    onPageChange(e: any) {
      const page = parseInt(e.currentTarget.dataset.page);
      this.setData({
        currentPage: page
      }, () => {
        this.loadData();
      });
    },
    
    onRowClick(e: any) {
      const item = e.currentTarget.dataset.item;
      this.setData({
        selectedBean: item,
        showModal: true
      });
    },
    
    stopPropagation(e: any) {
      // 阻止事件冒泡
    },
    
    onCloseModal() {
      this.setData({
        showModal: false
      });
    }
  }
})