// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import UserHome from './pages/UserHome'; // Halaman Toko Online Publik
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductDetail from './pages/ProductDetail';
import UserLayout from './components/UserLayout';

// --- HALAMAN ADMIN (Hanya bisa diakses jika Login + Role Admin) ---
function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-800">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Penjualan</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">Rp 15.000.000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Pesanan</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">120</p>
        </div>
      </div>
    </div>
  );
}

// --- LAYOUT ADMIN (Sidebar) ---
function AdminLayout({ user, setUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user} 
      />
      <div className="flex-1 flex flex-col lg:ml-0 w-full">
        <Navbar 
          user={user} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<AdminDashboardPage />} />
            <Route path="/products" element={<div className="p-10 text-center">Halaman Produk (Admin)</div>} />
            <Route path="/transactions" element={<div className="p-10 text-center">Halaman Transaksi (Admin)</div>} />
            <Route path="*" element={<div className="p-10 text-center">404 Halaman Admin</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
// --- KOMPONEN PENGAMAN ADMIN (PROTECTED ROUTE) ---
function ProtectedAdminRoute({ user, children }) {
  // 1. Cek apakah data user sudah ada (bukan object kosong)
  const isUserLoaded = user && Object.keys(user).length > 0;

  // 2. Jika data user BELUM terload (masih kosong), tampilkan loading atau null dulu
  // Jangan langsung redirect, biarkan useEffect selesai membaca localStorage
  if (!isUserLoaded) {
    return null; // Atau return <div>Loading...</div> jika ingin ada tampilan loading
  }

  // 3. Jika data user SUDAH terload, tapi role_id bukan 1
  if (user.role_id !== 1) {
    return <Navigate to="/" replace />;
  }

  // 4. Jika lolos semua (User ada & Role Admin)
  return children;
}

// --- ROUTING UTAMA ---
function AppRoutes({ user, setUser }) {
  
  // Cek LocalStorage saat load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [setUser]);

  return (
    <Routes>
      {/* --- ROUTE PUBLIK (DIBUNGKUS USER LAYOUT) --- */}
    <Route path="/" element={<UserLayout user={user} setUser={setUser} />}>
      {/* Halaman Utama */}
      <Route index element={<UserHome />} />
      
      {/* Halaman Detail Produk (Nested Route) */}
      <Route path="product/:id" element={<ProductDetail />} />
      
      {/* Bisa tambahkan route publik lain di sini, misal Cart, Profile, dll */}
      {/* <Route path="cart" element={<CartPage />} /> */}
    </Route>

    <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
      {/* 3. HALAMAN ADMIN (Protected) */}
      {/* Path dimulai dengan /admin */}
      <Route
        path="/admin/*" 
        element={
          <ProtectedAdminRoute user={user}>
            <AdminLayout user={user} setUser={setUser} />
          </ProtectedAdminRoute>
        }
      />

      {/* 4. 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState({});

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

export default App;