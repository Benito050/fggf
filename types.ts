export interface User {
  email: string;
}

export interface PriceComparison {
  store: string;
  price: number;
}

export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string; // base64 data URL
  material?: string;
  dimensions?: string;
  features?: string[];
  priceComparisons?: PriceComparison[];
}

export interface CartItem extends ProductData {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
}
