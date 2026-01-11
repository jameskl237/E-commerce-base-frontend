// Utilise la variable d'environnement REACT_APP_API_BASE_URL si présente,
// sinon fallback vers localhost.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://maketubackend.srv696182.hstgr.cloud';