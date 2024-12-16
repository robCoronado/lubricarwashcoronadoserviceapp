import React from 'react';
import { Plus, Settings } from 'lucide-react';
import type { ServiceCategory, Service } from '../../types/service';
import ServiceCard from './ServiceCard';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  services: Service[];
  onAddService: (categoryId: string) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onAddToCart?: (service: Service) => void;
}

export default function ServiceCategoryCard({
  category,
  services,
  onAddService,
  onEditService,
  onDeleteService,
  onAddToCart
}: ServiceCategoryCardProps) {
  const categoryServices = services.filter(s => s.categoryId === category.id);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
        <button
          onClick={() => onAddService(category.id)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={() => onEditService(service)}
            onDelete={() => onDeleteService(service.id)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {categoryServices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No services available in this category
        </div>
      )}
    </div>
  );
}