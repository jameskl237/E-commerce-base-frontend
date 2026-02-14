import React from "react";
import ProductCard from "./ProductCard";
import { FaStore } from "react-icons/fa";

const ProductGrid = ({ loading, error, products }) => {
  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // S'assurer que products est un tableau
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="product-grid">
      {safeProducts.length > 0 ? (
        safeProducts.map((p) => <ProductCard key={p.id} product={p} />)
      ) : (
        <div className="no-products">
          <FaStore size={48} />
          <h3>Aucun produit disponible pour le moment</h3>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
