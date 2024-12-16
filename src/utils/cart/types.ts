
import type { Product } from '../../types';
import type { Service } from '../../types/service';

export interface CartItemOptions {
  item: Product | Service;
  quantity: number;
  isService: boolean;
  serviceLiters?: number;
}

export interface CartValidationResult {
  isValid: boolean;
  error?: string;
}
