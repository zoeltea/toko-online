// src/pages/UserHome.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu as MenuIcon, X, ShoppingBag, Loader2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product';
import ShopNavbar from '../components/ShopNavbar';

// --- COMPONENTS ---

// 2. Card Produk
function ProductCard({ variant, onAdd }) {
  const { product, detail } = variant;
  const imageSrc = detail.image_url || product.image_url || "https://via.placeholder.com/300?text=No+Image";
  const displayName = detail.name_detail && detail.name_detail !== product.name 
    ? `${product.name} - ${detail.name_detail}` 
    : product.name;

  return (
    <Link
    // Link ke halaman detail dengan product_id dan query param detail_id
    to={`/product/${variant.product.id}?detail=${variant.detail.id}`}
    className="block group relative"
  >
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <div className="h-48 overflow-hidden bg-slate-100 relative">
        <img 
          src={imageSrc} 
          alt={displayName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
          {product.category || 'Umum'}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 text-sm md:text-base">
          {displayName}
        </h3>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">
          {product.description || detail.name_detail || 'Tidak ada deskripsi'}
        </p>
        <div className="text-xs text-slate-400 mb-2 flex gap-2">
           {detail.dimensions_length && <span>{detail.dimensions_length}x{detail.dimensions_width}cm</span>}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-blue-600">
            Rp {detail.price.toLocaleString('id-ID')}
          </span>
          <button
            onClick={(e) => {
               e.stopPropagation(); // CEGAH LINK SAAT TOMBOL DIKLIK
               onAdd(variant);
             }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition shadow-md shadow-blue-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
}

// --- MAIN COMPONENT ---
function UserHome({ user, setUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(10, 0); 
        const flattenedData = [];
        
        if (response && response.data && Array.isArray(response.data)) {
          response.data.forEach((prod) => {
            let selectedDetail = null;
            if (prod.product_details && Array.isArray(prod.product_details) && prod.product_details.length > 0) {
              selectedDetail = prod.product_details.find(d => d.image_url) || prod.product_details[0];
            } else {
              selectedDetail = { ...prod, id: `prod-${prod.id}`, price: prod.price || 0, image_url: prod.image_url };
            }
            if (selectedDetail) {
              flattenedData.push({ product: prod, detail: selectedDetail });
            }
          });
        }
        setProducts(flattenedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Filter Data
  const filteredProducts = products.filter((item) => {
    const product = item.product;
    const detail = item.detail;
    const matchCategory = activeTab === 'all' || product.category?.toLowerCase() === activeTab;
    const term = searchTerm.toLowerCase();
    const matchSearch = product.name?.toLowerCase().includes(term) || detail.name_detail?.toLowerCase().includes(term);
    return matchCategory && matchSearch;
  });

  const categories = ['all', ...new Set(products.map(p => p.product.category?.toLowerCase()).filter(Boolean))];

  const addToCart = (variant) => {
    const cartItem = {
      id: variant.detail.id,
      productId: variant.product.id,
      name: variant.product.name,
      variantName: variant.detail.name_detail,
      price: variant.detail.price,
      image: variant.detail.image_url || variant.product.image_url,
      qty: 1
    };
    setCart(prev => {
      const existing = prev.find(item => item.id === cartItem.id);
      if (existing) {
        return prev.map(item => item.id === cartItem.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, cartItem];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; 
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Temukan Produk Terbaik</h1>
          <p className="text-blue-100 text-sm md:text-base">Koleksi lengkap dengan berbagai pilihan varian.</p>
        </div>
      </section>

      {/* Tab Kategori */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm py-3">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                  activeTab === cat 
                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Produk */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
            <span className="ml-3 text-slate-500">Memuat produk...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((item, index) => (
              <ProductCard 
                key={`${item.product.id}-${item.detail.id}-${index}`} 
                variant={item} 
                onAdd={addToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">Produk tidak ditemukan.</div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Keranjang ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                  <img src={item.image || "https://via.placeholder.com/64"} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.variantName}</p>
                    <p className="text-blue-600 text-sm font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                    <div className="text-sm text-slate-500">Qty: {item.qty}</div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center text-slate-500 mt-10">Keranjang kosong.</p>}
            </div>
            {cart.length > 0 && (
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-4">
                Checkout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHome;