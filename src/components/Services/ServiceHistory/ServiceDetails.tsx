import React from 'react';
import { format } from 'date-fns';
import { Package, Wrench } from 'lucide-react';
import type { Service } from '../../../types/service';
import { useInventoryStore } from '../../../store/useInventoryStore';

interface ServiceDetailsProps {
  service: Service;
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const { products } = useInventoryStore();
  const product = service.productId ? products.find(p => p.id === service.productId) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {service.categoryId === '1' ? (
          <Wrench className="h-4 w-4 text-blue-500" />
        ) : (
          <Package className="h-4 w-4 text-purple-500" />
        )}
        <span className="font-medium text-gray-900">{service.title}</span>
      </div>
      
      {product && (
        <div className="text-sm text-gray-500">
          Product: {product.name}
        </div>
      )}
      
      {service.description && (
        <div className="text-sm text-gray-600">
          {service.description}
        </div>
      )}
      
      {service.addons.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Included Add-ons:</p>
          {service.addons.map((addon, index) => (
            <div key={index} className="flex justify-between text-xs text-gray-600">
              <span>{addon.name}</span>
              {!addon.isIncluded && (
                <span>${addon.price.toFixed(2)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}