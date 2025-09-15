import React from "react";
import ProductCard from "./ProductCard";
import { FaStore } from "react-icons/fa";

const ProductGrid = ({ loading, error, products }) => {
  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-grid">
      {products.length > 0 ? (
        products.map((p) => <ProductCard key={p.id} product={p} />)
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
