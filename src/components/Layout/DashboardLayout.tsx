import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setShowSidebar(true)} />
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setShowSidebar(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 w-full lg:w-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}