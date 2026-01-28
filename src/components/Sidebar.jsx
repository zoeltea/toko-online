// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // Daftar Menu
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Produk', path: '/admin/products', icon: Package },
    { name: 'Transaksi', path: '/admin/transactions', icon: ShoppingCart },
    { name: 'Pelanggan', path: '/customers', icon: Users },
    { name: 'Pengaturan', path: '/settings', icon: Settings },
  ];

  // Cek apakah menu sedang aktif
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay untuk Mobile (tutup sidebar jika klik di luar) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Logo Area */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-400">
              <LayoutDashboard className="w-6 h-6" />
              <span>AdminPanel</span>
            </div>
            {/* Tombol Close (Hanya Mobile) */}
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    // Tutup sidebar otomatis di mobile setelah klik menu
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout Area */}
          <div className="p-4 border-t border-slate-800">
             <button 
               // Hapus alert disini atau biarkan, pastikan tidak crash
               onClick={() => console.log("Logout clicked")}
               className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
             >
               <LogOut className="w-5 h-5" />
               Keluar
             </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;