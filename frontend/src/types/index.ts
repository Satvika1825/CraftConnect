export type UserRole = 'customer' | 'artisan' | 'admin';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  artisanId: string;
  artisanName: string;
  approved?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  banned?: boolean;
}
