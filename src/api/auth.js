// src/api/auth.js
const API_URL = "http://localhost:8080/api";

export const loginService = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Login gagal');

    const data = await response.json();
    return data; 
  } catch (error) {
    throw error;
  }
};