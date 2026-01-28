// src/components/ShopNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu as MenuIcon, X, LogOut } from 'lucide-react';

function ShopNavbar({ user, setUser, onSearch, cartCount, onOpenCart }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hitung CartCount jika belum dikirim dari luar (Opsional, fallback)
  const currentCartCount = cartCount || 0; 

  const isLoggedIn = user && Object.keys(user).length > 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMobileMenuOpen(false);
    // Redirect akan dihandle oleh AppRoutes logic nanti
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <ShoppingCart /> TokoMudah
        </Link>

        {/* Search Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          
          {/* Jika Belum Login -> Tampilkan Tombol Masuk */}
          {!isLoggedIn ? (
            <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              <User className="w-4 h-4" /> Masuk
            </Link>
          ) : (
            /* Jika Sudah Login -> Tampilkan Profile Dropdown */
            <div className="relative">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Bisa pakai state ini untuk desktop dropdown juga
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  {user.name || user.username}
                </span>
              </button>

              {/* Dropdown Menu Desktop */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                  <Link 
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    Profile Saya
                  </Link>
                  <Link 
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    Pesanan Saya
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={onOpenCart}
            className="relative p-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {currentCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {currentCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg z-30">
           {!isLoggedIn ? (
             <Link to="/login" className="block py-2 text-slate-600 font-medium">Masuk / Daftar</Link>
           ) : (
             <div>
               <p className="font-bold text-slate-800 mb-2">Halo, {user.name}</p>
               <button onClick={handleLogout} className="text-red-600 text-sm font-medium">Keluar</button>
             </div>
           )}
        </div>
      )}
    </header>
  );
}

export default ShopNavbar;