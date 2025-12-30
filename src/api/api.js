// src/api/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Attacher token automatiquement si présent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionnel : interceptor response pour gérer 401 / refresh token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // ici on peut centraliser la gestion d'expiration de token
    return Promise.reject(err);
  }
);

// Récupérer le cookie CSRF
export async function getCsrfCookie() {
  return await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    withCredentials: true,
  });
}

export default api;
