import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { API_BASE_URL } from '../../config/constants'; // Import the constant

const ProductShowPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data.data); // Assuming API returns { data: product_object }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-show-page">
      <h1>{product.name}</h1>
      {product.medias && product.medias.length > 0 && (
        <img
          src={product.medias[0].url || `${API_BASE_URL}/storage/${product.medias[0].file_path}`}
          alt={product.name}
          style={{ maxWidth: '400px', height: 'auto' }}
        />
      )}
      <p>Price: {product.price} FCFA</p>
      <p>Description: {product.description}</p>
      <p>Long Description: {product.long_description}</p>
      <p>Quantity: {product.quantity}</p>
      <p>In Stock: {product.in_stock ? 'Yes' : 'No'}</p>
      <p>Origin: {product.origin}</p>
      <p>Category: {product.category?.name || 'N/A'}</p>
      {/* Add more product details as needed */}
    </div>
  );
};

export default ProductShowPage;