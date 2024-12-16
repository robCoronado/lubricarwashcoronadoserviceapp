import React from 'react';
import { Package, Wrench, Plus } from 'lucide-react';
import type { Product } from '../../../types';
import type { Service } from '../../../types/service';
import { SearchResultCard } from './SearchResultCard';

interface SearchResultsProps {
  results: (Product | Service)[];
  onSelect: (item: Product | Service) => void;
  onQuickAdd: (item: Product | Service) => void;
}

export function SearchResults({ results, onSelect, onQuickAdd }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products or services found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {results.map((item) => (
        <SearchResultCard
          key={'id' in item ? item.id : item.title}
          item={item}
          onSelect={onSelect}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}