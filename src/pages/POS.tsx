import React, { useState } from 'react';
import { ShoppingCart, Search as SearchIcon, ListFilter } from 'lucide-react';
import ProductSearch from '../components/POS/ProductSearch';
import ProductCatalog from '../components/POS/ProductCatalog';
import TransactionList from '../components/POS/TransactionList';
import Cart from '../components/POS/Cart';
import CheckoutModal from '../components/POS/CheckoutModal';
import { usePOSStore } from '../store/usePOSStore';
import type { Product } from '../types';

export default function POS() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { addToCart, cart } = usePOSStore();

  const handleProductSelect = (
    product: Product,
    quantity: number,
    isService: boolean,
    serviceLiters?: number,
    selectedAddons?: string[]
  ) => {
    addToCart(product.id, quantity, isService, serviceLiters, selectedAddons);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Point of Sale</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ListFilter className="h-5 w-5" />
            <span className="hidden sm:inline">
              {showTransactions ? 'Show Products' : 'Transactions'}
            </span>
          </button>
          {!showTransactions && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <SearchIcon className="h-5 w-5" />
              <span className="hidden sm:inline">
                {showSearch ? 'Show Catalog' : 'Search'}
              </span>
            </button>
          )}
          <button
            onClick={() => setShowCart(true)}
            className="lg:hidden relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
            className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Checkout</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        <div className="flex-1 overflow-auto">
          {showTransactions ? (
            <TransactionList />
          ) : showSearch ? (
            <ProductSearch onProductSelect={handleProductSelect} />
          ) : (
            <ProductCatalog onProductSelect={handleProductSelect} />
          )}
        </div>
        <div className="hidden lg:block w-96">
          <Cart />
        </div>
      </div>

      {/* Mobile Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl p-4">
            <div className="max-h-[80vh] overflow-auto">
              <Cart />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowCart(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
                disabled={cart.length === 0}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}