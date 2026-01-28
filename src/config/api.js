// src/config/api.js

// Vite membaca env variable lewat import.meta.env
// Kita beri fallback (nilai cadangan) "" agar tidak error jika lupa bikin .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const API_BASE_URL = BASE_URL;