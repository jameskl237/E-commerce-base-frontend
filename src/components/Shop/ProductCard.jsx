import React from "react";
import { useCart } from "../../context/CartContext";

// L'URL de base de votre backend.
const API_BASE_URL = 'http://localhost:8000';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Fonction pour trouver l'URL de l'image principale.
  const getPrincipalImageUrl = () => {
    if (product && Array.isArray(product.medias) && product.medias.length > 0) {
      // 1. Chercher le média principal.
      const principalMedia = product.medias.find(m => m.is_principal);
      if (principalMedia && principalMedia.url) {
        const url = principalMedia.url;
        return url.startsWith('http') ? url : `${API_BASE_URL}/storage/${url.replace(/^\//, '')}`;
      }

      // 2. Si pas de principal, prendre le premier média de type image.
      const firstImage = product.medias.find(m => m.type === 'image' || !m.type); // Fallback for image
      if (firstImage && firstImage.url) {
        const url = firstImage.url;
        return url.startsWith('http') ? url : `${API_BASE_URL}/storage/${url.replace(/^\//, '')}`;
      }
    }

    // 3. Si aucune image, retourner l'image par défaut.
    return "/src/assets/default.jpg";
  };

  const imageUrl = getPrincipalImageUrl();

  return (
    <div className="product-card" key={product.id}>
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => { e.target.src = "/src/assets/default.jpg"; }}
        />
        {product.category && <span className="product-category">{product.category.name}</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="price">{product.price} FCFA</p>
        <div className="product-actions">
          <button className="buy-btn" onClick={() => addToCart(product)}>Ajouter au panier</button>
          <button className="details-btn">Détails</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
