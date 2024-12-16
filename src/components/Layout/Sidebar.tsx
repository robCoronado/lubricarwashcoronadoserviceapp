import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Package, ShoppingCart, Users, Car, BarChart2, Settings } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'Inventory', to: '/inventory', icon: Package },
  { name: 'POS', to: '/pos', icon: ShoppingCart },
  { name: 'Customers', to: '/customers', icon: Users },
  { name: 'Services', to: '/services', icon: Car },
  { name: 'Reports', to: '/reports', icon: BarChart2 },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="h-full flex flex-col bg-white shadow-sm">
      {onClose && (
        <div className="p-4 flex justify-end lg:hidden">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
      
      <nav className="flex-1 px-2 pb-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}