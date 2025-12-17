export interface CoffeeBean {
  altitude: string;
  code: string;
  country: string;
  data_month: number;
  data_year: number;
  density: string;
  flavor_profile: string;
  grade: string;
  harvest_season: number;
  name: string;
  origin: string;
  price_per_kg: number | null;
  price_per_pkg: number | null;
  processing_method: string;
  provider: string;
  type: string;
  variety: string;
}

export interface Pagination {
  has_next: boolean;
  has_prev: boolean;
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface CoffeeBeansResponse {
  data: CoffeeBean[];
  pagination: Pagination;
}