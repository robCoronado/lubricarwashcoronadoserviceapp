import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventoryStore } from './useInventoryStore';
import { useServiceStore } from './useServiceStore';
import { calculateServicePrice, createServiceCartItem, updateServiceCartPrice, calculateCartItemTotal } from '../utils/cart/servicePricing';
import { validateQuantity, validateBarrelService } from '../utils/cart/validation';
import { isBarrelProduct } from '../utils/cart/helpers';
import { calculateItemPrice } from '../utils/cart/pricing';
import type { CartItem, Transaction } from '../types';

interface POSState {
  cart: CartItem[];
  transactions: Transaction[];
  addToCart: (itemId: string, quantity: number, isService: boolean, serviceLiters?: number, selectedAddons?: string[]) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const usePOSStore = create<POSState>()(
  persist(
    (set, get) => ({
      cart: [],
      transactions: [],
      
      addToCart: (itemId, quantity, isService, serviceLiters, selectedAddons = []) => {
        const { products } = useInventoryStore.getState();
        const { services } = useServiceStore.getState();
        
        // Find item in either products or services
        const product = products.find(p => p.id === itemId);
        const service = services.find(s => s.id === itemId);
        
        if (!product && !service) {
          throw new Error('Item not found');
        }

        let cartItem: CartItem;
        
        if (service) {
          // Handle service with addons
          cartItem = createServiceCartItem(service, quantity, selectedAddons);
        } else if (product) {
          // Handle product
          const quantityValidation = validateQuantity(product, quantity);
          if (!quantityValidation.isValid) {
            throw new Error(quantityValidation.error);
          }

          if (isService && isBarrelProduct(product)) {
            const serviceValidation = validateBarrelService(product, serviceLiters);
            if (!serviceValidation.isValid) {
              throw new Error(serviceValidation.error);
            }
          }

          cartItem = {
            productId: product.id,
            quantity,
            price: calculateItemPrice(product, isService),
            isService,
            serviceLiters: isService && isBarrelProduct(product) ? serviceLiters : undefined
          };
        }

        set(state => {
          const existingItemIndex = state.cart.findIndex(item => 
            item.productId === itemId && item.isService === cartItem.isService
          );

          if (existingItemIndex >= 0) {
            const updatedCart = [...state.cart];
            const existingItem = updatedCart[existingItemIndex];

            if (service) {
              // Update service with new addons
              updatedCart[existingItemIndex] = updateServiceCartPrice(
                existingItem,
                service,
                selectedAddons
              );
            } else {
              // Update quantity for products
              updatedCart[existingItemIndex] = {
                ...existingItem,
                quantity: existingItem.quantity + quantity
              };
            }

            return { cart: updatedCart };
          }

          return { cart: [...state.cart, cartItem] };
        });
      },

      removeFromCart: (itemId) => 
        set(state => ({
          cart: state.cart.filter(item => item.productId !== itemId)
        })),

      updateQuantity: (itemId, quantity) =>
        set(state => ({
          cart: state.cart.map(item =>
            item.productId === itemId ? { ...item, quantity } : item
          )
        })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + calculateCartItemTotal(item), 0);
      }
    }),
    {
      name: 'pos-storage',
      version: 2,
    }
  )
);