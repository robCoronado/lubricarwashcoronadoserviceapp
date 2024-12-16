import React from 'react';
import { Edit2, Trash2, ShoppingCart } from 'lucide-react';
import type { Service } from '../../types/service';
import toast from 'react-hot-toast';

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart?: (service: Service) => void;
}

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
  onAddToCart
}: ServiceCardProps) {
  const totalPrice = service.price + 
    service.addons
      .filter(addon => !addon.isIncluded)
      .reduce((sum, addon) => sum + addon.price, 0);

  const handleAddToCart = () => {
    try {
      onAddToCart?.(service);
      toast.success('Service added to cart');
    } catch (error) {
      toast.error('Failed to add service to cart');
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-medium text-gray-900">{service.title}</h4>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-500"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600">{service.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {service.vehicleTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {type}
              </span>
            ))}
          </div>

          {service.addons.length > 0 && (
            <div className="border-t pt-2 mt-2">
              <p className="text-sm font-medium text-gray-700">Add-ons:</p>
              <ul className="mt-1 space-y-1">
                {service.addons.map((addon) => (
                  <li key={addon.id} className="text-sm text-gray-600 flex justify-between">
                    <span>{addon.name}</span>
                    <span>
                      {addon.isIncluded ? (
                        <span className="text-green-600">Included</span>
                      ) : (
                        <span>${addon.price.toFixed(2)}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="text-lg font-semibold text-gray-900">
              ${totalPrice.toFixed(2)}
            </div>
            {onAddToCart && (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}