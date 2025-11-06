import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL API Laravel
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProductById = (id) => api.get(`/products/${id}`);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export default api;