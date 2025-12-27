import api from '../api/api'; // Importer l'instance configurée

export const getProductById = (id) => api.get(`/products/${id}`);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export default api;