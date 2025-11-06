import React from 'react';
import './ProductForm.scss';

const ProductForm = ({ product, onChange, onSubmit }) => {
  // Gestionnaire de changement pour tous les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...product, [name]: value });
  };

  // Prévenir le rechargement de la page à la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Détails du Produit</h2>
      
      <div className="form-group">
        <label htmlFor="name">Nom du produit</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product?.name || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={product?.description || ''}
          onChange={handleChange}
          rows="5"
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="price">Prix</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product?.price || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product?.stock || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Modifier le Produit
      </button>
    </form>
  );
};

export default ProductForm;
