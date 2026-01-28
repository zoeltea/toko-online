// src/api/productDetail.js

const API_URL = "http://localhost:8080/api";

export const getProductById = async (productId) => {
  try {
    // Endpoint sesuai permintaan Anda
    const response = await fetch(`${API_URL}/products?ids=${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil detail produk');
    }

    const data = await response.json();
    
    // Response API adalah { data: [ product ] }
    // Kita ambil elemen pertama (index 0) karena kita minta 1 ID
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    
    throw new Error('Produk tidak ditemukan dalam data');
    
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};