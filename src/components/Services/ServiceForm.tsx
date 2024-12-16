import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import type { Service, ServiceAddon } from '../../types/service';
import toast from 'react-hot-toast';

interface ServiceFormProps {
  categoryId: string;
  service?: Service | null;
  onSubmit: (data: Omit<Service, 'id'>) => void;
  onClose: () => void;
}

export default function ServiceForm({
  categoryId,
  service,
  onSubmit,
  onClose
}: ServiceFormProps) {
  const { products } = useInventoryStore();
  
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    categoryId,
    title: service?.title || '',
    vehicleTypes: service?.vehicleTypes || [],
    type: service?.type || '',
    price: service?.price || 0,
    description: service?.description || '',
    addons: service?.addons || [],
    productId: service?.productId,
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.vehicleTypes.length === 0) {
      toast.error('Please select at least one vehicle type');
      return;
    }

    onSubmit(formData);
  };

  const handleAddAddon = () => {
    setFormData(prev => ({
      ...prev,
      addons: [
        ...prev.addons,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          price: 0,
          isIncluded: false
        }
      ]
    }));
  };

  const handleRemoveAddon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  const updateAddon = (index: number, field: keyof ServiceAddon, value: any) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.map((addon, i) =>
        i === index ? { ...addon, [field]: value } : addon
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Types *
            </label>
            <div className="space-y-2">
              {['motorcycle', 'car', 'truck'].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.vehicleTypes.includes(type as any)}
                    onChange={(e) => {
                      const types = e.target.checked
                        ? [...formData.vehicleTypes, type]
                        : formData.vehicleTypes.filter(t => t !== type);
                      setFormData({ ...formData, vehicleTypes: types as any[] });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {categoryId === '1' ? ( // Vehicle Cleaning
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cleaning Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="basic">Basic Wash</option>
                <option value="premium">Premium Wash</option>
                <option value="deluxe">Deluxe Wash</option>
                <option value="interior">Interior Cleaning</option>
                <option value="exterior">Exterior Detailing</option>
              </select>
            </div>
          ) : ( // Vehicle Maintenance
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product *
              </label>
              <select
                value={formData.productId || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value);
                  setFormData({
                    ...formData,
                    productId: e.target.value,
                    price: product?.priceOptions.find(opt => opt.type === 'service')?.price || 0
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base Price *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Add-ons
              </label>
              <button
                type="button"
                onClick={handleAddAddon}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                Add Add-on
              </button>
            </div>

            <div className="space-y-4">
              {formData.addons.map((addon, index) => (
                <div key={addon.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    
                    <input
                      type="text"
                      value={addon.name}
                      onChange={(e) => updateAddon(index, 'name', e.target.value)}
                      placeholder="Add-on name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="w-32">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        /*value={addon.price}*/
                        value={addon.price}
                        onChange={(e) => updateAddon(index, 'price', parseFloat(e.target.value) || 0)}
                        className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                        disabled={addon.isIncluded}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={addon.isIncluded}
                      onChange={(e) => updateAddon(index, 'isIncluded', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Included</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveAddon(index)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}