import React, { useState } from 'react';
import { Plus, History } from 'lucide-react';
import { useServiceStore } from '../store/useServiceStore';
import { usePOSStore } from '../store/usePOSStore';
import ServiceCategoryCard from '../components/Services/ServiceCategoryCard';
import ServiceForm from '../components/Services/ServiceForm';
import CategoryForm from '../components/Services/CategoryForm';
import ServiceHistoryList from '../components/Services/ServiceHistory/ServiceHistoryList';
import type { Service, ServiceCategory } from '../types/service';
import toast from 'react-hot-toast';

export default function Services() {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { categories, services, addCategory, addService, updateService, deleteService } = useServiceStore();
  const { addToCart } = usePOSStore();

  const handleAddService = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAddService(true);
  };

  const handleServiceSubmit = (serviceData: Omit<Service, 'id'>) => {
    if (editingService) {
      updateService({ ...editingService, ...serviceData });
      toast.success('Service updated successfully');
    } else {
      addService(serviceData);
      toast.success('Service added successfully');
    }
    setShowAddService(false);
    setEditingService(null);
  };

  const handleAddToCart = (service: Service) => {
    try {
      addToCart(service.id, 1, true);
      toast.success('Service added to cart');
    } catch (error) {
      toast.error('Failed to add service to cart');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <History className="h-5 w-5" />
            {showHistory ? 'Show Services' : 'Service History'}
          </button>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {showHistory ? (
        <ServiceHistoryList />
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <ServiceCategoryCard
              key={category.id}
              category={category}
              services={services}
              onAddService={handleAddService}
              onEditService={setEditingService}
              onDeleteService={deleteService}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {showAddCategory && (
        <CategoryForm
          onSubmit={(category) => {
            addCategory(category);
            setShowAddCategory(false);
          }}
          onClose={() => setShowAddCategory(false)}
        />
      )}

      {showAddService && (
        <ServiceForm
          categoryId={selectedCategory!}
          service={editingService}
          onSubmit={handleServiceSubmit}
          onClose={() => {
            setShowAddService(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}