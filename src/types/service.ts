import { Product } from './index';

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  isIncluded: boolean;
  productId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  title: string;
  vehicleTypes: ('motorcycle' | 'car' | 'truck')[];
  type: string;
  price: number;
  description: string;
  addons: ServiceAddon[];
  productId?: string;
  status: 'active' | 'inactive';
  customerId?: string;
  receiptNumber?: string;
  date?: string;
}