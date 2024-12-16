import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useServiceStore } from '../../../store/useServiceStore';
import type { Product } from '../../../types';
import type { Service } from '../../../types/service';

interface SearchTest {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string[];
}

export function SearchDiagnostics() {
  const { products } = useInventoryStore();
  const { services } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [testResults, setTestResults] = useState<SearchTest[]>([]);

  const runDiagnostics = () => {
    const results: SearchTest[] = [];

    // Test 1: Product Data Availability
    const availableProducts = products.filter(p => p.isAvailableForPOS && p.status === 'active');
    results.push({
      name: 'Product Data Check',
      status: availableProducts.length > 0 ? 'success' : 'error',
      message: availableProducts.length > 0 
        ? `Found ${availableProducts.length} available products`
        : 'No products available for POS',
      details: availableProducts.length === 0 ? [
        'Check product availability settings',
        'Verify product status is set to active',
        'Ensure products are properly imported'
      ] : undefined
    });

    // Test 2: Service Data Availability
    const activeServices = services.filter(s => s.status === 'active');
    results.push({
      name: 'Service Data Check',
      status: activeServices.length > 0 ? 'success' : 'warning',
      message: activeServices.length > 0
        ? `Found ${activeServices.length} active services`
        : 'No active services found',
      details: activeServices.length === 0 ? [
        'Verify services are properly configured',
        'Check service status settings'
      ] : undefined
    });

    // Test 3: Search Query Test
    if (searchQuery.length >= 2) {
      const searchTerm = searchQuery.toLowerCase();
      const productResults = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm)
      );
      const serviceResults = services.filter(s =>
        s.title.toLowerCase().includes(searchTerm)
      );

      results.push({
        name: 'Search Results',
        status: productResults.length > 0 || serviceResults.length > 0 ? 'success' : 'warning',
        message: `Found ${productResults.length} products and ${serviceResults.length} services`,
        details: [
          `Search term: "${searchQuery}"`,
          `Product matches: ${productResults.length}`,
          `Service matches: ${serviceResults.length}`
        ]
      });
    }

    // Test 4: Data Integrity Check
    const invalidProducts = findInvalidProducts(products);
    const invalidServices = findInvalidServices(services);

    results.push({
      name: 'Data Integrity',
      status: invalidProducts.length === 0 && invalidServices.length === 0 ? 'success' : 'error',
      message: invalidProducts.length === 0 && invalidServices.length === 0
        ? 'All records are properly formatted'
        : 'Found data integrity issues',
      details: [
        ...invalidProducts.map(p => `Product "${p.name}": Missing ${p.issues.join(', ')}`),
        ...invalidServices.map(s => `Service "${s.title}": Missing ${s.issues.join(', ')}`)
      ]
    });

    setTestResults(results);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Search System Diagnostics</h3>
        <div className="flex gap-4">
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Test search term..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={runDiagnostics}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Run Diagnostics
          </button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                {result.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : result.status === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{result.name}</h4>
                  <p className="text-sm text-gray-500">{result.message}</p>
                  {result.details && result.details.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                      {result.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function findInvalidProducts(products: Product[]): Array<{ name: string; issues: string[] }> {
  return products.reduce<Array<{ name: string; issues: string[] }>>((acc, product) => {
    const issues: string[] = [];
    if (!product.name) issues.push('name');
    if (!product.sku) issues.push('SKU');
    if (!product.priceOptions || product.priceOptions.length === 0) issues.push('price options');
    if (!product.stockUnit) issues.push('stock information');

    if (issues.length > 0) {
      acc.push({ name: product.name || 'Unknown Product', issues });
    }
    return acc;
  }, []);
}

function findInvalidServices(services: Service[]): Array<{ title: string; issues: string[] }> {
  return services.reduce<Array<{ title: string; issues: string[] }>>((acc, service) => {
    const issues: string[] = [];
    if (!service.title) issues.push('title');
    if (!service.categoryId) issues.push('category');
    if (!service.price) issues.push('price');
    if (!service.vehicleTypes || service.vehicleTypes.length === 0) issues.push('vehicle types');

    if (issues.length > 0) {
      acc.push({ title: service.title || 'Unknown Service', issues });
    }
    return acc;
  }, []);
}