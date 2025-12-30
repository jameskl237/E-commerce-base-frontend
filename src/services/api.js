import api from '../api/api'; // Importer l'instance configurée

export const getProductById = (id) => api.get(`/products/${id}`);

export const updateProduct = (id, formData) => {
  // On utilise POST car on envoie des FormData. Laravel utilisera le champ `_method: 'PUT'`
  return api.post(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;