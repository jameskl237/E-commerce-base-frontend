import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { API_BASE_URL } from '../../config/constants';
import './ProductShowPage.scss';
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductShowPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.data);
      console.log("Product supplier shop name:", res.data.data.shop?.user?.name);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <p>Chargement...</p>;
  if (!product) return <p>Produit introuvable</p>;

  const images =
    product.medias?.map(
      m => `${API_BASE_URL}/storage/${m.url.replace(/^\//, '')}`
    ) || [];

  const nextImage = () =>
    setCurrentIndex((currentIndex + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex(
      (currentIndex - 1 + images.length) % images.length
    );

  return (
    <div className="product-show-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Retour
      </button>

      <div className="product-layout">
        {/* ===== IMAGE BLOCK ===== */}
        <div className="image-block">
          <div className="carousel">
            <button onClick={prevImage} className="nav left">
              <FiChevronLeft />
            </button>

            <img src={images[currentIndex]} alt={product.name} />

            <button onClick={nextImage} className="nav right">
              <FiChevronRight />
            </button>
          </div>

          <div className="dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={index === currentIndex ? 'active' : ''}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* ===== INFO BLOCK ===== */}
        <div className="info-block">
          <h1>{product.name}</h1>
          <p className="price">{product.price} FCFA</p>

          <p className="description">{product.description}</p>

          <div className="meta">
            <span><strong>Stock :</strong> {product.in_stock ? 'Disponible' : 'Rupture'}</span>
            <span><strong>Quantité :</strong> {product.quantity}</span>
            <span><strong>Origine :</strong> {product.origin}</span>
            <span><strong>Catégorie :</strong> {product.category?.name}</span>
            <span><strong>Boutique :</strong> {product.shop?.name}</span>
            <span><strong>Fournisseur :</strong> {product.shop.user?.name}</span>
          </div>

          <div className="actions">
            <button className="cart">Ajouter au panier</button>
            <button className="buy">Acheter maintenant</button>
          </div>

          <div className="details">
            <h2>Description détaillée</h2>
            <p>{product.long_description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowPage;
