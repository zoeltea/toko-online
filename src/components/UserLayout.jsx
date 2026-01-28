// src/components/UserLayout.jsx
import {useState,useEffect, react, } from 'react';
import ShopNavbar from './ShopNavbar'; // Sekarang harusnya tidak error
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';

function UserLayout({ user, setUser }) {
  // Kita butuh state cartCount dan isCartOpen di sini agar global untuk layout ini
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Listener untuk storage agar cartCount di Navbar update saat tambah dari halaman lain
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(total);
    };

    // Panggil sekali saat mount
    updateCartCount();

    // Dengar event storage
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount); // Custom event

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <ShopNavbar
        user={user} 
        setUser={setUser}
        onSearch={setSearchTerm}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <div className="animate-fade-in">
        {/* Di sini UserHome dan ProductDetail akan dirender */}
        <Outlet context={{ searchTerm, isCartOpen, setIsCartOpen }} />
      </div>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 TokoMudah. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer Global (Opsional) */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col">
             {/* ... Konten Cart Sama seperti di Home ... */}
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">Keranjang ({cartCount})</h2>
               <button onClick={() => setIsCartOpen(false)}><X /></button>
             </div>
             {/* List Cart Items... */}
             <div className="flex-1 overflow-y-auto">
                {/* Logic ambil cart dari localStorage */}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserLayout;