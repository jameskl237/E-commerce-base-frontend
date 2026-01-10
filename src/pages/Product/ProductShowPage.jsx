import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { API_BASE_URL } from '../../config/constants';
import './ProductShowPage.scss';
import { useCart } from '../../context/CartContext';
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductShowPage = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  // Helper function to normalize phone number
  const normalizePhone = (raw) => {
    if (!raw) return null;
    const digits = String(raw).replace(/\D+/g, '');
    if (!digits) return null;
    const cleaned = digits.replace(/^0+/, '');
    return cleaned.length < 8 ? null : cleaned;
  };

  const handleBuyNow = () => {
    const phone = normalizePhone(product.shop?.phone);

    if (!phone) {
      toast.error("Le numéro de téléphone de la boutique n'est pas disponible.");
      return;
    }

    const message = `Bonjour, je suis intéressé par votre produit "${product.name}" au prix de ${product.price} FCFA. Est-il toujours disponible ?`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  const handleViewShop = () => {
    if (product.shop?.id && product.shop?.name) {
      navigate(`/shop/${product.shop.id}/${product.shop.name}`);
    } else {
      toast.error("Information sur la boutique non disponible.");
    }
  };

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
            <button className="cart" onClick={() => addToCart(product)}>Ajouter au panier</button>
            <button className="buy" onClick={handleBuyNow}>Acheter maintenant</button>
            {product.shop && (
              <button className="view-shop" onClick={handleViewShop}>
                Voir boutique
              </button>
            )}
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
