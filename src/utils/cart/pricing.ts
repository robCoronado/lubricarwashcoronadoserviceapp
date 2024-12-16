import type { Product, CartItem } from '../../types';
import type { Service } from '../../types/service';

/**
 * Calculate total for a cart item including quantity and addons
 */
export function calculateItemTotal(item: CartItem): number {
  const baseTotal = item.price * item.quantity;
  
  if (item.addonPrices) {
    const addonTotal = item.addonPrices.reduce((sum, addon) => sum + addon.price, 0);
    return baseTotal + (addonTotal * item.quantity);
  }
  
  return baseTotal;
}

/**
 * Get base price for a product or service
 */
export function getItemPrice(item: Product | Service, withService: boolean): number {
  if ('title' in item) {
    // Item is a service
    return item.price;
  }

  // Item is a product
  const priceOption = item.priceOptions.find(opt => 
    opt.type === (withService ? 'service' : 'unit')
  );

  if (!priceOption) {
    throw new Error(`${withService ? 'Service' : 'Unit'} price not found for product`);
  }

  return priceOption.price;
}

/**
 * Calculate total price including quantity
 */
export function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

/**
 * Calculate final price with all options
 */
export function calculateItemPrice(item: Product | Service, withService: boolean): number {
  const basePrice = getItemPrice(item, withService);
  
  if ('title' in item) {
    // For services, include any non-included addon prices
    return basePrice + item.addons
      .filter(addon => !addon.isIncluded)
      .reduce((sum, addon) => sum + addon.price, 0);
  }
  
  return basePrice;
}