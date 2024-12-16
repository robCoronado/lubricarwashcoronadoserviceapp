import React from 'react';
import { Package, Wrench, Plus } from 'lucide-react';
import type { Product } from '../../../types';
import { ServiceSelector } from '../Cart/ServiceSelector';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onQuickAdd }: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product);
  };

  const unitPrice = product.priceOptions.find(opt => opt.type === 'unit');
  const servicePrice = product.priceOptions.find(opt => opt.type === 'service');

  return (
    <div 
      onClick={() => onSelect(product)}
      className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer"
    >
      <div className="aspect-w-1 aspect-h-1 w-full relative">
        <img
          src={product.images[0]?.url || 'https://images.unsplash.com/photo-1635951444472-325a984b2c88'}
          alt={product.name}
          className="object-cover w-full h-48"
        />
        <button
          onClick={handleQuickAdd}
          className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        
        <div className="space-y-1">
          {unitPrice && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4 flex-shrink-0" />
              <span>${unitPrice.price.toFixed(2)}</span>
            </div>
          )}
          {servicePrice && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wrench className="h-4 w-4 flex-shrink-0" />
              <span>${servicePrice.price.toFixed(2)} with service</span>
            </div>
          )}
        </div>

        <div className="text-sm">
          <span className={`font-medium ${
            product.stockUnit.fullUnits <= product.minStockLevel 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            Stock: {product.stockUnit.fullUnits} {product.stockUnit.type}(s)
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}