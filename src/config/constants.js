// Utilise la variable d'environnement VITE_API_BASE_URL si présente,
// sinon fallback vers l'URL de production actuelle.
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_ROOT ||
  'https://maketubackend.srv696182.hstgr.cloud';

const normalizedBaseUrl = String(rawBaseUrl).replace(/\/+$/, '');

export const API_BASE_URL = normalizedBaseUrl;
export const API_ROOT = normalizedBaseUrl;
export const API_BASE = `${normalizedBaseUrl}/api`;

export const USE_CSRF = String(import.meta.env.VITE_USE_CSRF || '').toLowerCase() === 'true';
