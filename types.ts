export interface User {
  email: string;
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
}

export interface CartItem extends ProductData {
  quantity: number;
}
