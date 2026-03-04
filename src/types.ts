export interface Market {
  id: number;
  name: string;
  logo: string;
  cover_image?: string;
  address: string;
  phone: string;
  hours: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  image_url: string;
}

export interface Offer {
  id: number;
  market_id: number;
  product_id: number;
  price: number;
  valid_until: string;
  created_at: string;
  // Joins
  product_name?: string;
  brand?: string;
  image_url?: string;
  market_name?: string;
  market_logo?: string;
}
