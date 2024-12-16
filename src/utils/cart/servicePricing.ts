import type { Service, ServiceAddon } from '../../types/service';
import type { CartItem } from '../../types';

interface ServicePriceDetails {
  basePrice: number;
  addonPrices: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  totalPrice: number;
}

/**
 * Calculate total price for a service including selected addons
 */
export function calculateServicePrice(
  service: Service,
  selectedAddons: string[] = []
): ServicePriceDetails {
  // Get base service price
  const basePrice = service.price;

  // Calculate addon prices - only include non-included addons that are selected
  const addonPrices = service.addons
    .filter(addon => !addon.isIncluded && selectedAddons.includes(addon.id))
    .map(addon => ({
      id: addon.id,
      name: addon.name,
      price: addon.price
    }));

  // Calculate total price (base price + sum of addon prices)
  const addonTotal = addonPrices.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = basePrice + addonTotal;

  return {
    basePrice,
    addonPrices,
    totalPrice
  };
}

/**
 * Create a cart item from a service with selected addons
 */
export function createServiceCartItem(
  service: Service,
  quantity: number = 1,
  selectedAddons: string[] = []
): CartItem {
  const priceDetails = calculateServicePrice(service, selectedAddons);

  return {
    productId: service.id,
    quantity,
    price: priceDetails.basePrice, // Store base price separately
    isService: true,
    selectedAddons,
    addonPrices: priceDetails.addonPrices // Store addon prices for total calculation
  };
}

/**
 * Update cart item price when addons change
 */
export function updateServiceCartPrice(
  cartItem: CartItem,
  service: Service,
  selectedAddons: string[]
): CartItem {
  const priceDetails = calculateServicePrice(service, selectedAddons);

  return {
    ...cartItem,
    price: priceDetails.basePrice, // Update base price
    selectedAddons,
    addonPrices: priceDetails.addonPrices // Update addon prices
  };
}

/**
 * Calculate total price for a cart item including addons
 */
export function calculateCartItemTotal(cartItem: CartItem): number {
  const baseTotal = cartItem.price * cartItem.quantity;
  
  if (cartItem.addonPrices) {
    const addonTotal = cartItem.addonPrices.reduce((sum, addon) => sum + addon.price, 0);
    return baseTotal + (addonTotal * cartItem.quantity);
  }
  
  return baseTotal;
}