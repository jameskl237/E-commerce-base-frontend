import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductEditPage.scss';

// Import des composants enfants
import MediaCarousel from '../../../../components/management/product-edit/MediaCarousel';
import ProductForm from '../../../../components/management/product-edit/ProductForm';

// Import des fonctions API
import { getProductById, updateProduct } from '../../../../services/api';
import api from '../../../../api/api';

import SupplierLayout from '../../../../components/management/SupplierLayout';

const ProductEditPageContent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        setLoading(true);
        // Fetch product data
        const productData = await getProductById(productId);
        console.log('Fetched product data:', productData.data.data);
        setProduct(productData.data.data);

        // Fetch categories
        let response;
        try {
          response = await api.get("/categories");
        } catch {
          try {
            response = await api.get("/product-categories");
          } catch {
            response = await api.get("/api/categories");
          }
        }
        const categoriesData = response.data?.data || response.data || [];
        console.log('Fetched categories data:', categoriesData);
        setCategories(categoriesData);

      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        console.error(err);
         setCategories([
          { id: 1, name: "Électronique", slug: "electronics" },
          { id: 2, name: "Vêtements", slug: "clothing" },
          { id: 3, name: "Maison & Jardin", slug: "home" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [productId]);

  const handleFormChange = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  const handleFormSubmit = async () => {
    try {
      await updateProduct(productId, product);
      console.log('Submitting product update:', product);
      alert('Produit mis à jour avec succès !');
      if (product && product.shop_id) {
        navigate(`/supplier/dashboard/${product.shop_id}`); // Rediriger vers le tableau de bord de la boutique
      } else {
        navigate('/supplier/shops/dashboard'); // Fallback si le shopId n'est pas disponible
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour du produit.');
      console.error(err);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className="product-edit-page">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FiArrowLeft />
            <span>Retour</span>
          </button>
          <h1>Édition du Produit</h1>
        </div>
        <div className="edit-container">
          <div className="media-section">
            {product && <MediaCarousel product={product} />}
          </div>
          <div className="form-section">
            {product && (
              <ProductForm
                product={product}
                categories={categories}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
              />
            )}
          </div>
        </div>
      </div>
  );
};

const ProductEditPage = () => {
  return (
    <SupplierLayout>
      <ProductEditPageContent />
    </SupplierLayout>
  );
};

export default ProductEditPage;
