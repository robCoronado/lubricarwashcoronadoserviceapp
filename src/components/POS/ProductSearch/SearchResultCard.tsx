import React from 'react';
import { Package, Wrench, Plus } from 'lucide-react';
import type { Product } from '../../../types';
import type { Service } from '../../../types/service';
import { getItemPrice } from '../../../utils/cart/pricing';

interface SearchResultCardProps {
  item: Product | Service;
  onSelect: (item: Product | Service) => void;
  onQuickAdd: (item: Product | Service) => void;
}

export function SearchResultCard({ item, onSelect, onQuickAdd }: SearchResultCardProps) {
  const isProduct = 'stockUnit' in item;
  const image = isProduct ? (item as Product).images[0]?.url : undefined;
  const name = isProduct ? (item as Product).name : (item as Service).title;
  const description = item.description;
  const basePrice = getItemPrice(item, false);
  const servicePrice = isProduct ? getItemPrice(item as Product, true) : undefined;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(item);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
    >
      {image && (
        <div className="aspect-w-1 aspect-h-1 w-full relative">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-48"
          />
          <button
            onClick={handleQuickAdd}
            className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          {isProduct ? (
            <Package className="h-4 w-4 text-gray-500" />
          ) : (
            <Wrench className="h-4 w-4 text-blue-500" />
          )}
          <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
        </div>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        )}

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              ${basePrice.toFixed(2)}
            </span>
            {isProduct && (
              <span className={`text-sm font-medium ${
                (item as Product).stockUnit.fullUnits <= (item as Product).minStockLevel
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                Stock: {(item as Product).stockUnit.fullUnits}
              </span>
            )}
          </div>
          {servicePrice && (
            <div className="text-sm text-gray-500">
              Service: ${servicePrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}