// src/api/api.js
import axios from "axios";

const API_ROOT = "https://maketubackend.srv696182.hstgr.cloud";
const API_BASE = `${API_ROOT}/api`;

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

// Interceptor response pour gérer 401 / expiration de token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Si erreur 401 (non autorisé), le token est invalide ou expiré
    if (err.response?.status === 401) {
      // Nettoyer le token invalide
      localStorage.removeItem("access_token");
      
      // Éviter les boucles infinies si on est déjà sur /login
      if (window.location.pathname !== "/login") {
        // Déclencher un événement pour notifier AuthProvider
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    }
    return Promise.reject(err);
  }
);

// Récupérer le cookie CSRF
export async function getCsrfCookie() {
  return await axios.get(`${API_ROOT}/backend/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

export default api;
