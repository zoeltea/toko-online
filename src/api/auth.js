// src/api/auth.js
import { API_BASE_URL } from '../config/api'; // Import variabel

export const loginService = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Login gagal');

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};