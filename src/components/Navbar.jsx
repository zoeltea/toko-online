// src/components/Navbar.jsx
import React from 'react';
import { ShoppingCart, Bell, Menu } from 'lucide-react';

function Navbar({ user, toggleSidebar }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Tombol Menu (Hanya Mobile) */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-semibold text-slate-800">
          {user ? `Halo, ${user.name || user.username}` : 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-700 relative">
          <ShoppingCart className="w-5 h-5" />
        </button>
        
        {/* Avatar User (Sederhana) */}
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
          {user ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
}

export default Navbar;