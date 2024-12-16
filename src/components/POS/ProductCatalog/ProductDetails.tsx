import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../../types';
import { QuantitySelector } from '../Cart/QuantitySelector';
import { ServiceSelector } from '../Cart/ServiceSelector';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (quantity: number, isService: boolean, serviceLiters?: number) => void;
}

export function ProductDetails({ product, onClose, onAddToCart }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isService, setIsService] = useState(false);
  const [serviceLiters, setServiceLiters] = useState(0);

  const serviceOption = product.priceOptions.find(opt => opt.type === 'service');
  const isBarrelProduct = product.stockUnit.type === 'barrel';

  const handleAddToCart = () => {
    onAddToCart(quantity, isService, isService && isBarrelProduct ? serviceLiters : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <img
            src={product.images[0]?.url || 'https://images.unsplash.com/photo-1635951444472-325a984b2c88'}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stockUnit.fullUnits}
            onChange={setQuantity}
          />

          {serviceOption && (
            <ServiceSelector
              isService={isService}
              servicePrice={serviceOption.price}
              serviceOptions={serviceOption.serviceOptions || []}
              onToggle={setIsService}
            />
          )}

          {isService && isBarrelProduct && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Service Liters
              </label>
              <input
                type="number"
                value={serviceLiters}
                onChange={(e) => setServiceLiters(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}