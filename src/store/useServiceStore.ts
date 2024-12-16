import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createVersionedStorage } from '../utils/storage';
import type { Service, ServiceCategory } from '../types/service';

interface ServiceState {
  categories: ServiceCategory[];
  services: Service[];
  addCategory: (category: Omit<ServiceCategory, 'id'>) => Promise<ServiceCategory>;
  updateCategory: (category: ServiceCategory) => Promise<ServiceCategory>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<Service>;
  updateService: (service: Service) => Promise<Service>;
  deleteService: (serviceId: string) => Promise<void>;
  updateServiceHistory: (serviceId: string, customerId: string, receiptNumber: string) => Promise<void>;
}

export const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      categories: [
        { id: '1', name: 'Vehicle Cleaning', slug: 'vehicle-cleaning' },
        { id: '2', name: 'Vehicle Maintenance', slug: 'vehicle-maintenance' }
      ],
      services: [],
      addCategory: async (categoryData) => {
        const newCategory = {
          ...categoryData,
          id: Math.random().toString(36).substr(2, 9)
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
        return newCategory;
      },
      updateCategory: async (updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          ),
        }));
        return updatedCategory;
      },
      deleteCategory: async (categoryId) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== categoryId),
          services: state.services.filter((service) => service.categoryId !== categoryId),
        }));
      },
      addService: async (serviceData) => {
        const newService = {
          ...serviceData,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active' as const,
          date: new Date().toISOString()
        };
        set((state) => ({
          services: [...state.services, newService],
        }));
        return newService;
      },
      updateService: async (updatedService) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === updatedService.id ? updatedService : service
          ),
        }));
        return updatedService;
      },
      deleteService: async (serviceId) => {
        set((state) => ({
          services: state.services.filter((service) => service.id !== serviceId),
        }));
      },
      updateServiceHistory: async (serviceId, customerId, receiptNumber) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === serviceId
              ? {
                  ...service,
                  customerId,
                  receiptNumber,
                  date: new Date().toISOString()
                }
              : service
          ),
        }));
      },
    }),
    {
      name: 'service-storage',
      version: 3,
      storage: createVersionedStorage(3),
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          return {
            ...persistedState,
            services: (persistedState.services || []).map((service: Service) => ({
              ...service,
              status: service.status || 'active',
              customerId: service.customerId || undefined,
              receiptNumber: service.receiptNumber || undefined,
              date: service.date || new Date().toISOString()
            }))
          };
        }
        return persistedState;
      },
    }
  )
);