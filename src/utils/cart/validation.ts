import type { Product } from '../../types';
import type { CartValidationResult } from './types';

/**
 * Validate barrel service requirements
 */
export function validateBarrelService(product: Product, serviceLiters?: number): CartValidationResult {
  if (product.stockUnit.type !== 'barrel') {
    return { isValid: true };
  }

  if (!serviceLiters || serviceLiters <= 0) {
    return {
      isValid: false,
      error: 'Please specify the number of liters required'
    };
  }

  const availableLiters = product.stockUnit.partialUnit || 0;
  if (serviceLiters > availableLiters) {
    return {
      isValid: false,
      error: `Cannot exceed available liters (${availableLiters.toFixed(1)}L)`
    };
  }

  const maxCapacity = product.stockUnit.capacity || 0;
  if (serviceLiters > maxCapacity) {
    return {
      isValid: false,
      error: `Cannot exceed barrel capacity (${maxCapacity.toFixed(1)}L)`
    };
  }

  return { isValid: true };
}

/**
 * Validate product quantity
 */
export function validateQuantity(product: Product, quantity: number): CartValidationResult {
  if (quantity <= 0) {
    return {
      isValid: false,
      error: 'Quantity must be greater than 0'
    };
  }

  if (quantity > product.stockUnit.fullUnits) {
    return {
      isValid: false,
      error: `Cannot exceed available stock (${product.stockUnit.fullUnits})`
    };
  }

  return { isValid: true };
}