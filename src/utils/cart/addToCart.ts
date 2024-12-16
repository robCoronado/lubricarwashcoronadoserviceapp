import type { Product } from '../../types';

interface AddToCartOptions {
  product: Product;
  withService: boolean;
  quantity?: number;
  serviceLiters?: number;
}

export function calculateItemPrice(product: Product, withService: boolean): number {
  const priceOption = product.priceOptions.find(opt => 
    opt.type === (withService ? 'service' : 'unit')
  );

  if (!priceOption) {
    throw new Error(`${withService ? 'Service' : 'Unit'} price not found for product`);
  }

  return priceOption.price;
}

export function validateCartItem({ product, withService, quantity = 1, serviceLiters }: AddToCartOptions) {
  // Check if product is available for POS
  if (!product.isAvailableForPOS || product.status !== 'active') {
    throw new Error('Product is not available for sale');
  }

  // Check stock availability
  if (quantity > product.stockUnit.fullUnits) {
    throw new Error('Insufficient stock');
  }

  // Validate service liters for barrel products
  if (withService && product.stockUnit.type === 'barrel') {
    if (!serviceLiters || serviceLiters <= 0) {
      throw new Error('Service liters must be specified for barrel products');
    }
    
    const availableLiters = product.stockUnit.partialUnit || 0;
    if (serviceLiters > availableLiters) {
      throw new Error(`Cannot exceed available liters (${availableLiters.toFixed(1)}L)`);
    }
  }

  return true;
}

export function createCartItem({ 
  product, 
  withService, 
  quantity = 1,
  serviceLiters 
}: AddToCartOptions) {
  // Validate the cart item first
  validateCartItem({ product, withService, quantity, serviceLiters });

  // Calculate the appropriate price
  const price = calculateItemPrice(product, withService);

  // Create the cart item
  return {
    productId: product.id,
    quantity,
    price,
    isService: withService,
    serviceLiters: withService && product.stockUnit.type === 'barrel' ? serviceLiters : undefined
  };
}