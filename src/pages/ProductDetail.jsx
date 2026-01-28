// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate  } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Loader2, Star, Package, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { getProductById } from '../api/productDetail';

function ProductDetail() {
  const { id } = useParams(); 
  const [searchParams] = useSearchParams();
  const initialDetailId = searchParams.get('detail');
  
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id); 
        
        if (data) {
          setProduct(data);
          const details = data.product_details || [];
          setAllVariants(details);
          
          if (details.length > 0) {
            if (initialDetailId) {
              const initial = details.find(d => d.id == initialDetailId);
              setSelectedVariant(initial || details[0]);
            } else {
              const withImage = details.find(d => d.image_url);
              setSelectedVariant(withImage || details[0]);
            }
          } else {
            setSelectedVariant({
              id: data.id,
              name_detail: data.name,
              price: 0, 
              image_url: data.image_url,
              stock_quantity: 0
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, initialDetailId]);

  // Fungsi Ganti Gambar
  const changeImage = (direction) => {
    if (allVariants.length === 0) return;
    const currentIndex = allVariants.findIndex(v => v.id === selectedVariant.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % allVariants.length;
    } else {
      newIndex = (currentIndex - 1 + allVariants.length) % allVariants.length;
    }
    setSelectedVariant(allVariants[newIndex]);
  };

  // Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      variantName: selectedVariant.name_detail,
      price: selectedVariant.price,
      image: selectedVariant.image_url || product.image_url,
      qty: qty
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = existingCart.find(item => item.id === cartItem.id);
    
    let newCart;
    if (existing) {
      newCart = existingCart.map(item => item.id === cartItem.id ? { ...item, qty: item.qty + qty } : item);
    } else {
      newCart = [...existingCart, cartItem];
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage')); // Update navbar count
    
    // Trigger custom event untuk UserLayout
    window.dispatchEvent(new Event('cartUpdated'));
    
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h1>
        <Link to="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const mainImage = selectedVariant?.image_url || product?.image_url || "https://via.placeholder.com/600x600?text=No+Image";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Container Dibatasi Lebar agar Nyaman Dilihat (max-w-5xl = 1024px) */}
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Grid: Gambar Kiri | Info Kanan */}
          {/* Di Mobile stacked, di Desktop 50:50 */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* --- BAGIAN KIRI: GAMBAR GALERI --- */}
            <div className="p-4 md:p-8 bg-slate-50 flex flex-col justify-center items-center relative">
              
              {/* Tombol Navigasi Gambar */}
              {allVariants.length > 1 && (
                <>
                  <button onClick={() => changeImage('prev')} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-slate-800 transition z-10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => changeImage('next')} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-slate-800 transition z-10">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Gambar Utama (Lebar lebih kecil dibanding sebelumnya) */}
              <div className="relative w-full aspect-square max-w-[450px] bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex items-center justify-center group">
                <img 
                  src={mainImage} 
                  alt={selectedVariant.name_detail || product.name} 
                  className="w-full h-full object-contain p-4 transition-transform duration-500"
                />
              </div>

              {/* Indikator Dots */}
              {allVariants.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {allVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        selectedVariant.id === variant.id ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* --- BAGIAN KANAN: INFO PRODUK --- */}
            <div className="p-4 md:p-8 flex flex-col h-full border-t lg:border-t-0 lg:border-l border-slate-200">
              
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] md:text-xs font-bold uppercase rounded tracking-wide">
                  {product.category}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                ))}
                <span className="text-xs md:text-sm text-slate-500 ml-2 font-medium">(4.8/5.0)</span>
              </div>

              <div className="w-full h-px bg-slate-100 mb-4"></div>

              <div className="mb-3">
                <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                  Rp {selectedVariant?.price.toLocaleString('id-ID', {minimumFractionDigits: 0})}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {product.description || 'Tidak ada deskripsi produk.'}
                </p>
              </div>

              {/* PILIHAN VARIASI (GRID UKURAN KECIL) */}
              {allVariants.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2 text-xs md:text-sm font-semibold text-slate-700">
                    <Layers className="w-3.5 h-3.5" />
                    Pilih Ukuran:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allVariants.map((variant) => {
                      const isActive = selectedVariant.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`
                            relative p-2 rounded-md border text-[10px] md:text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center text-center
                            ${isActive 
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                          `}
                        >
                          <span className="leading-tight">
                            {variant.dimensions_length && variant.dimensions_width && variant.dimensions_height
                              ? `${variant.dimensions_length} x ${variant.dimensions_width} x ${variant.dimensions_height} ${variant.unit}`
                              : variant.name_detail
                            }
                          </span>
                          <span className={`text-[9px] mt-0.5 font-bold ${isActive ? 'text-blue-800' : 'text-slate-400'}`}>
                            {(variant.price / 1000).toFixed(0)}rb
                          </span>
                          {variant.stock_quantity === 0 && (
                             <span className="absolute top-1 right-1 text-[8px] text-red-500 font-bold leading-none">X</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spesifikasi Detail Tambahan */}
              <div className="bg-slate-50 rounded-lg p-3 mb-6 space-y-2 border border-slate-100 text-xs">
                 <div className="flex justify-between">
                  <span className="text-slate-500">Varian:</span>
                  <span className="font-medium text-slate-900">{selectedVariant?.name_detail || '-'}</span>
                </div>
                {selectedVariant?.weight_kg && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Berat:</span>
                    <span className="font-medium text-slate-900">{selectedVariant.weight_kg} kg</span>
                  </div>
                )}
                {selectedVariant?.stock_quantity !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Stok:</span>
                    <span className={`font-bold ${selectedVariant.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedVariant.stock_quantity > 0 ? `Tersedia` : 'Habis'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="font-medium text-slate-700 text-xs">Jumlah:</span>
                  <div className="flex items-center border border-slate-300 rounded bg-white">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-slate-100 text-slate-600"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-8 text-center font-semibold text-slate-900 text-sm">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-slate-100 text-slate-600"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={selectedVariant?.stock_quantity <= 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {selectedVariant?.stock_quantity > 0 ? 'Tambahkan ke Keranjang' : 'Stok Habis'}
                </button>

                <button className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all text-sm">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce-in">
          <div className="bg-green-500 p-1.5 rounded-full">
            <Check className="text-white w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-xs">Berhasil Ditambahkan</p>
            <p className="text-[10px] text-slate-300">Ke keranjang belanja.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;