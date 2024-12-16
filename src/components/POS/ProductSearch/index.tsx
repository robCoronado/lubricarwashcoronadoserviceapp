import React, { useState, useMemo } from 'react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useServiceStore } from '../../../store/useServiceStore';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { ProductModal } from './ProductModal';
import type { Product } from '../../../types';
import type { Service } from '../../../types/service';
import { isBarrelProduct } from '../../../utils/cart/helpers';
import toast from 'react-hot-toast';

interface ProductSearchProps {
  onProductSelect: (product: Product, quantity: number, isService: boolean, serviceLiters?: number, selectedAddons?: string[]) => void;
}

export default function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Product | Service | null>(null);
  const { products } = useInventoryStore();
  const { services } = useServiceStore();

  const searchResults = useMemo(() => {
    if (query.length < 2) return [];

    const searchTerm = query.toLowerCase();
    const filteredProducts = products.filter(product => {
      if (!product.isAvailableForPOS || product.status !== 'active') return false;
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    });

    const filteredServices = services.filter(service => {
      if (service.status !== 'active') return false;
      return (
        service.title.toLowerCase().includes(searchTerm) ||
        service.description?.toLowerCase().includes(searchTerm)
      );
    });

    return [...filteredProducts, ...filteredServices];
  }, [query, products, services]);

  const handleQuickAdd = (item: Product | Service) => {
    try {
      if ('title' in item) { // Is a service
        onProductSelect(item as any, 1, true, undefined, []);
      } else { // Is a product
        onProductSelect(item, 1, false);
      }
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToCart = (quantity: number, isService: boolean, serviceLiters?: number, selectedAddons?: string[]) => {
    if (!selectedItem) return;

    try {
      if ('title' in selectedItem) { // Is a service
        onProductSelect(selectedItem as any, quantity, true, undefined, selectedAddons);
      } else { // Is a product
        if (isService && isBarrelProduct(selectedItem) && !serviceLiters) {
          throw new Error('Service liters required for barrel products');
        }
        onProductSelect(selectedItem, quantity, isService, serviceLiters);
      }
      setSelectedItem(null);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />

      {query.length >= 2 && (
        <SearchResults
          results={searchResults}
          onSelect={setSelectedItem}
          onQuickAdd={handleQuickAdd}
        />
      )}

      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}