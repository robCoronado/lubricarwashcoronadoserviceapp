import { generateReceiptNumber } from '../receipt';
import type { CartItem, Transaction, PaymentDetails } from '../../types';
import { calculateItemTotal } from './pricing';

interface CheckoutOptions {
  cart: CartItem[];
  payment: PaymentDetails;
  customerId?: string;
}

interface CheckoutResult {
  transaction: Transaction;
  success: boolean;
  error?: string;
}

/**
 * Process checkout and create transaction
 */
export async function processCheckout({
  cart,
  payment,
  customerId
}: CheckoutOptions): Promise<CheckoutResult> {
  try {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate totals
    const items = cart.map(item => ({
      ...item,
      subtotal: calculateItemTotal(item)
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = 0; // Add discount logic if needed
    const finalTotal = total - discount;

    // Create transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      receiptNumber: generateReceiptNumber(),
      date: new Date().toISOString(),
      items,
      total,
      discount,
      finalTotal,
      payment,
      status: 'completed',
      customerId
    };

    return {
      transaction,
      success: true
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      transaction: null as any,
      success: false,
      error: error instanceof Error ? error.message : 'Checkout failed'
    };
  }
}