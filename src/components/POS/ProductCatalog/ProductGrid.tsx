import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../../../types';

interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductGrid({ products, onSelect, onQuickAdd }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelect}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}