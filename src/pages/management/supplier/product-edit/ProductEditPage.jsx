import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductEditPage.scss';

// Import des composants enfants
import MediaCarousel from '../../../../components/management/product-edit/MediaCarousel';
import ProductForm from '../../../../components/management/product-edit/ProductForm';

// Import des fonctions API
import { getProductById, updateProduct } from '../../../../services/api'; // Assumant l'existence de ces fonctions

import SupplierLayout from '../../../../components/management/SupplierLayout';



const ProductEditPageContent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Simuler des données pour le développement
        // Remplacer par l'appel API réel : const data = await getProductById(productId);
        const mockData = {
          id: productId,
          name: 'Produit Exemple',
          description: 'Ceci est une description détaillée du produit. On peut la modifier.',
          price: 99.99,
          stock: 150,
          media: [
            { type: 'image', url: 'https://via.placeholder.com/400x300.png/007bff/ffffff?text=Image+1' },
            { type: 'image', url: 'https://via.placeholder.com/400x300.png/28a745/ffffff?text=Image+2' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_hts-samp.mp4' }, // Smaller placeholder video
            { type: 'image', url: 'https://via.placeholder.com/400x300.png/dc3545/ffffff?text=Image+3' },
          ]
        };
        setProduct(mockData);
      } catch (err) {
        setError('Erreur lors de la récupération du produit.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleFormChange = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  const handleFormSubmit = async () => {
    try {
      // Remplacer par l'appel API réel: await updateProduct(productId, product);
      alert('Produit mis à jour avec succès !');
      navigate('/supplier/management'); // Rediriger vers la page de gestion
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
            {product && <MediaCarousel media={product.media} />}
          </div>
          <div className="form-section">
            {product && (
              <ProductForm
                product={product}
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
