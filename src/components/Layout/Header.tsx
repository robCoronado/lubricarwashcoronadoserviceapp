import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Settings, LogOut, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePOSStore } from '../../store/usePOSStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cart } = usePOSStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              Lubricar & Wash
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate('/pos')}
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}