import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../../types';
import type { Service } from '../../../types/service';
import { QuantitySelector } from '../Cart/QuantitySelector';
import { ServiceSelector } from '../Cart/ServiceSelector';
import { calculateServicePrice } from '../../../utils/cart/servicePricing';
import { getItemPrice, calculateTotal } from '../../../utils/cart/pricing';
import BarrelServiceForm from '../BarrelServiceForm';
import { isBarrelProduct, hasServiceOption } from '../../../utils/cart/helpers';
import { validateBarrelService } from '../../../utils/cart/validation';

interface ProductModalProps {
  item: Product | Service;
  onClose: () => void;
  onAddToCart: (quantity: number, isService: boolean, serviceLiters?: number, selectedAddons?: string[]) => void;
}

export function ProductModal({ item, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [withService, setWithService] = useState(false);
  const [serviceLiters, setServiceLiters] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [totalPrice, setTotalPrice] = useState(0);

  const isProduct = 'stockUnit' in item;
  const hasService = isProduct && hasServiceOption(item);
  const isBarrel = isProduct && isBarrelProduct(item);

  // Calculate total price whenever relevant values change
  useEffect(() => {
    if ('title' in item) { // Service
      const priceDetails = calculateServicePrice(item, selectedAddons);
      setTotalPrice(calculateTotal(priceDetails.totalPrice, quantity));
    } else { // Product
      const basePrice = getItemPrice(item, withService);
      setTotalPrice(calculateTotal(basePrice, quantity));
    }
  }, [item, quantity, withService, selectedAddons]);

  const handleAddToCart = () => {
    try {
      setError(undefined);

      // Validate barrel service requirements
      if (isBarrel && withService) {
        const validation = validateBarrelService(item as Product, serviceLiters);
        if (!validation.isValid) {
          setError(validation.error);
          return;
        }
      }

      onAddToCart(quantity, withService, serviceLiters, selectedAddons);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isProduct ? item.name : item.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isProduct && item.images[0] && (
          <div className="mb-4">
            <img
              src={item.images[0].url}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4">
          <QuantitySelector
            quantity={quantity}
            maxQuantity={isProduct ? item.stockUnit.fullUnits : 99}
            onChange={setQuantity}
          />

          {hasService && (
            <ServiceSelector
              isService={withService}
              servicePrice={getItemPrice(item as Product, true)}
              serviceOptions={item.priceOptions.find(opt => opt.type === 'service')?.serviceOptions || []}
              onToggle={setWithService}
            />
          )}

          {'addons' in item && item.addons.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Additional Services:</p>
              {item.addons.map(addon => (
                <label key={addon.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={(e) => {
                      setSelectedAddons(prev => 
                        e.target.checked
                          ? [...prev, addon.id]
                          : prev.filter(id => id !== addon.id)
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={addon.isIncluded}
                  />
                  <span className="text-sm text-gray-700">
                    {addon.name}
                    {!addon.isIncluded && ` (+$${addon.price.toFixed(2)})`}
                    {addon.isIncluded && ' (Included)'}
                  </span>
                </label>
              ))}
            </div>
          )}

          {isBarrel && withService && (
            <BarrelServiceForm
              product={item as Product}
              serviceLiters={serviceLiters}
              onLitersChange={setServiceLiters}
              error={error}
            />
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Price per unit:</span>
              <span>${(totalPrice / quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium mt-2">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
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