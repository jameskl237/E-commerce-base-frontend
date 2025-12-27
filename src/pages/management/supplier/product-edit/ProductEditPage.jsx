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

import { toast } from 'react-toastify';

const ProductEditPageContent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Nouveaux états pour la gestion des médias
  const [newFiles, setNewFiles] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);


  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData.data.data);

        const response = await api.get("/categories");
        const categoriesData = response.data?.data || response.data || [];
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

  // Gérer la suppression d'un média existant
  const handleDeleteMedia = (mediaId) => {
    // Ajouter l'ID à la liste des médias à supprimer
    setMediaToDelete(prev => [...prev, mediaId]);
    // Mettre à jour l'UI en retirant le média de l'état du produit
    setProduct(prev => ({
      ...prev,
      medias: prev.medias.filter(media => media.id !== mediaId)
    }));
  };
  
  // Gérer l'ajout/suppression de nouveaux fichiers
  const handleFilesChange = (files, action) => {
    if (action === 'add') {
      // Éviter les doublons
      const uniqueNewFiles = files.filter(
        file => !newFiles.some(existingFile => existingFile.name === file.name)
      );
      setNewFiles(prev => [...prev, ...uniqueNewFiles]);
    } else if (action === 'remove') {
      setNewFiles(prev => prev.filter((_, index) => index !== files)); // 'files' est l'index ici
    }
  };

  const handleFormChange = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();

    // 1. Ajouter les champs du produit
    Object.keys(product).forEach(key => {
      // Ne pas ajouter les médias existants directement
      if (key !== 'medias' && key !== 'category') {
        formData.append(key, product[key]);
      }
    });
    // Gérer la catégorie (envoyer l'ID)
    if (product.category_id) {
       formData.append('category_id', product.category_id);
    }


    // 2. Ajouter les nouveaux fichiers
    newFiles.forEach(file => {
      formData.append('new_files[]', file);
    });

    // 3. Ajouter les IDs des médias à supprimer
    if (mediaToDelete.length > 0) {
      mediaToDelete.forEach(id => {
        formData.append('media_to_delete[]', id);
      });
    }

    // 4. Spécifier la méthode PUT pour Laravel
    formData.append('_method', 'PUT');

    try {
      setLoading(true);
      await updateProduct(productId, formData);
      sessionStorage.setItem('updateSuccess', 'Produit mis à jour avec succès !');

      if (product && product.shop_id) {
        navigate(`/supplier/dashboard/${product.shop_id}`);
      } else {
        navigate('/supplier/shops/dashboard');
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du produit.');
      console.error(err);
    } finally {
      setLoading(false);
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
            {product && <MediaCarousel product={product} onDelete={handleDeleteMedia} />}
          </div>
          <div className="form-section">
            {product && (
              <ProductForm
                product={product}
                categories={categories}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                newFiles={newFiles}
                onFilesChange={handleFilesChange}
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
