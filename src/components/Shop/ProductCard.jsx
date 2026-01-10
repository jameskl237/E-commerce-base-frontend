import React from "react";
import { useCart } from "../../context/CartContext";
import defaultImg from "../../assets/default.jpg"; // fallback image import

// L'URL de base de votre backend.
const API_BASE_URL = 'http://localhost:8000';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Fonction pour trouver l'URL de l'image principale.
  const getPrincipalImageUrl = () => {
    if (product) {
      // 0. fallback s'il existe un champ direct (thumbnail, image, picture, etc.)
      const direct =
        product.thumbnail ||
        product.image ||
        product.picture ||
        product.img ||
        product.photo;
      if (direct) {
        const url = String(direct);
        if (url.startsWith("http") || url.startsWith("//")) return url;
        return `${API_BASE_URL}/storage/${url.replace(/^\/+/, "")}`;
      }

      // 1. Si medias est un tableau, chercher media principal avec plusieurs variantes de clé
      if (Array.isArray(product.medias) && product.medias.length > 0) {
        const candidates = product.medias;

        // chercher propriétés qui peuvent indiquer le principal
        const principal =
          candidates.find(m => m.is_principal) ||
          candidates.find(m => m.isPrincipal) ||
          candidates.find(m => m.isMain) ||
          candidates.find(m => m.is_main) ||
          candidates.find(m => m.type === "primary") ||
          candidates.find(m => m.role === "primary");

        if (principal && (principal.url || principal.path || principal.full_url)) {
          const raw = principal.url || principal.full_url || principal.path || "";
          const url = String(raw);
          if (!url) return defaultImg;
          if (url.startsWith("http") || url.startsWith("//")) return url;
          return `${API_BASE_URL}/storage/${url.replace(/^\/+/, "")}`;
        }

        // 2. fallback: premier média ayant une URL
        const firstWithUrl = candidates.find(m => m.url || m.path || m.full_url);
        if (firstWithUrl) {
          const raw = firstWithUrl.url || firstWithUrl.full_url || firstWithUrl.path || "";
          const url = String(raw);
          if (!url) return defaultImg;
          if (url.startsWith("http") || url.startsWith("//")) return url;
          return `${API_BASE_URL}/storage/${url.replace(/^\/+/, "")}`;
        }
      }
    }

    // 3. Si aucune image trouvée, retourner l'image par défaut.
    return defaultImg;
  };

  const imageUrl = getPrincipalImageUrl();

  return (
    <div className="product-card" key={product?.id}>
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product?.name || "Produit"}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultImg; }}
        />
        {product?.category && <span className="product-category">{product.category.name}</span>}
      </div>
      <div className="product-info">
        <h3>{product?.name}</h3>
        <p className="product-description">{product?.description}</p>
        <p className="price">{product?.price} FCFA</p>
        <div className="product-actions">
          <button className="buy-btn" onClick={() => addToCart(product)}>Ajouter au panier</button>
          <button className="details-btn">Détails</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
