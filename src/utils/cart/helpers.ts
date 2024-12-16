import type { Product } from '../../types';

/**
 * Check if product is a barrel type
 */
export function isBarrelProduct(product: Product): boolean {
  return product.stockUnit.type === 'barrel';
}

/**
 * Check if product has service options
 */
export function hasServiceOption(product: Product): boolean {
  return product.priceOptions.some(opt => opt.type === 'service');
}

/**
 * Get service price if available
 */
export function getServicePrice(product: Product): number | undefined {
  return product.priceOptions.find(opt => opt.type === 'service')?.price;
}

/**
 * Get unit price
 */
export function getUnitPrice(product: Product): number | undefined {
  return product.priceOptions.find(opt => opt.type === 'unit')?.price;
}