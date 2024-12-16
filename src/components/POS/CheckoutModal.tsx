import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { processCheckout } from '../../utils/cart/checkout';
import { generateReceipt } from '../../utils/receipt';
import { CustomerSearchInput } from './CustomerSearch';
import { CustomerCard } from './CustomerCard';
import type { Customer } from '../../types/customer';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, getCartTotal, clearCart } = usePOSStore();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardVoucher, setCardVoucher] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();

  const handleCheckout = async () => {
    if (cart.length === 0 || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      const payment = {
        method: paymentMethod,
        ...(paymentMethod === 'card' && { cardVoucher }),
      };

      // Process checkout
      const result = await processCheckout({
        cart,
        payment,
        customerId: selectedCustomer?.id
      });

      if (!result.success) {
        throw new Error(result.error || 'Checkout failed');
      }

      // Generate receipt
      const receiptDelivery = selectedCustomer ? {
        ...(selectedCustomer.email && { email: selectedCustomer.email }),
        ...(selectedCustomer.whatsappPhone && { whatsapp: selectedCustomer.whatsappPhone }),
      } : undefined;

      await generateReceipt(result.transaction, receiptDelivery);
      
      clearCart();
      toast.success('Transaction completed successfully');
      onClose();

    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Checkout</h3>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer Selection */}
          {selectedCustomer ? (
            <CustomerCard 
              customer={selectedCustomer} 
              onClose={() => setSelectedCustomer(null)} 
            />
          ) : (
            <CustomerSearchInput onSelect={setSelectedCustomer} />
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isProcessing}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {paymentMethod === 'card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Payment Voucher Number *
              </label>
              <input
                type="text"
                value={cardVoucher}
                onChange={(e) => setCardVoucher(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isProcessing}
                required
              />
            </div>
          )}

          {/* Totals */}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}