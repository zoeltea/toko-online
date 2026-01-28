// src/api/product.js

import { API_BASE_URL } from '../config/api'; // Import variabel

export const getProducts = async (limit = 10, offset = 0) => {
  try {
    console.log(`Mengambil produk: limit=${limit}, offset=${offset}`);
    
    const response = await fetch(`${API_BASE_URL}/products/list?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data produk');
    }

    const data = await response.json();
    console.log("Response API Mentah:", data); // Cek di Console Browser
    
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};