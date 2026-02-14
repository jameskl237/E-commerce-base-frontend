// src/api/api.js
import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:8000";
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

// Interceptor response pour normaliser les réponses et gérer 401 / expiration de token
api.interceptors.response.use(
  (res) => {
    // Normaliser la structure de réponse pour garantir que res.data.data existe toujours
    // et est un tableau pour les endpoints qui retournent des listes
    if (res.data && typeof res.data === 'object') {
      // Si la réponse a la structure {success, message, data, ...}
      if (res.data.hasOwnProperty('data')) {
        // S'assurer que data est toujours un tableau si c'est une liste
        if (res.data.data === null || res.data.data === undefined) {
          res.data.data = [];
        } else if (!Array.isArray(res.data.data) && typeof res.data.data === 'object') {
          // Si data est un objet unique, le laisser tel quel (pour les endpoints show)
          // Ne rien faire
        }
      }
    }
    return res;
  },
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
  return await axios.get(`${API_ROOT}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

export default api;
