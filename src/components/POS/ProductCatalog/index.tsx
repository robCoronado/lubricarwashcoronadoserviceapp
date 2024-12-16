import React, { useState, useMemo } from 'react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { ProductSearch } from './ProductSearch';
import { ProductGrid } from './ProductGrid';
import { ProductDetails } from './ProductDetails';
import type { Product } from '../../../types';
import toast from 'react-hot-toast';

interface ProductCatalogProps {
  onProductSelect: (product: Product, quantity: number, isService: boolean, serviceLiters?: number) => void;
}

export default function ProductCatalog({ onProductSelect }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useInventoryStore();

  const filteredProducts = useMemo(() => {
    if (searchQuery.length < 2) return products;

    const searchTerm = searchQuery.toLowerCase();
    return products.filter(product => {
      if (!product.isAvailableForPOS || product.status !== 'active') return false;
      
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    });
  }, [products, searchQuery]);

  const handleQuickAdd = (product: Product) => {
    try {
      onProductSelect(product, 1, false);
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleAddToCart = (quantity: number, isService: boolean, serviceLiters?: number) => {
    if (!selectedProduct) return;

    try {
      onProductSelect(selectedProduct, quantity, isService, serviceLiters);
      setSelectedProduct(null);
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  return (
    <div className="space-y-6">
      <ProductSearch
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <ProductGrid
        products={filteredProducts}
        onSelect={setSelectedProduct}
        onQuickAdd={handleQuickAdd}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}