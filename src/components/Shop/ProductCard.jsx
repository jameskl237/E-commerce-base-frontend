import React from "react";

const ProductCard = ({ product }) => (
  <div className="product-card" key={product.id}>
    <div className="product-image">
      <img
        src={product.image_url || "/src/assets/default.jpg"}
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
        <button className="buy-btn">Ajouter au panier</button>
        <button className="details-btn">Détails</button>
      </div>
    </div>
  </div>
);

export default ProductCard;
