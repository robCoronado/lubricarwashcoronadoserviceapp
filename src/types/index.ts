import type { ServiceAddon } from './service';

// Update CartItem type to include addon information
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  isService: boolean;
  serviceLiters?: number;
  selectedAddons?: string[];
  addonPrices?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

// ... rest of the file remains unchanged