import React from 'react';
import { FiUpload, FiTrash2, FiImage, FiVideo } from 'react-icons/fi';
import './ProductForm.scss';

const ProductForm = ({ product, categories, onChange, onSubmit, newFiles, onFilesChange }) => {
  // Gestionnaire de changement pour tous les inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'in_stock') {
      val = value === 'true';
    } else if (name === 'category') {
      val = parseInt(value, 10);
      onChange({ ...product, category_id: val });
      return;
    }
    onChange({ ...product, [name]: val });
  };

  // Prévenir le rechargement de la page à la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
     if (files.length > 0) {
      onFilesChange(files, 'add');
    }
     // Vider l'input pour permettre de resélectionner le même fichier
    e.target.value = '';
  };

  const removeNewFile = (index) => {
    onFilesChange(index, 'remove');
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Détails du Produit</h2>
      
      {/* ... existing form groups ... */}
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
        <label htmlFor="description">Description Courte</label>
        <textarea
          id="description"
          name="description"
          value={product?.description || ''}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="long_description">Description Longue</label>
        <textarea
          id="long_description"
          name="long_description"
          value={product?.long_description || ''}
          onChange={handleChange}
          rows="6"
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
          <label htmlFor="promotion_price">Prix de Promotion</label>
          <input
            type="number"
            id="promotion_price"
            name="promotion_price"
            value={product?.promotion_price || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="quantity">Quantité</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={product?.quantity || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="in_stock">En Stock</label>
          <select
            id="in_stock"
            name="in_stock"
            value={product?.in_stock || false}
            onChange={handleChange}
          >
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="origin">Origine</label>
          <select
            id="origin"
            name="origin"
            value={product?.origin || 'local'}
            onChange={handleChange}
          >
            <option value="local">Local</option>
            <option value="imported">Importé</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={product?.category_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section pour ajouter de nouveaux médias */}
      <div className="file-upload-section">
        <label className="file-upload-label">
          <FiUpload />
          <span>Ajouter de nouveaux médias</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
        <p className="file-info">Vous pouvez ajouter de nouvelles images ou vidéos ici.</p>
      </div>

      {/* Prévisualisation des nouveaux fichiers */}
      {newFiles && newFiles.length > 0 && (
        <div className="files-preview">
          <h4>Nouveaux médias à ajouter :</h4>
          <div className="files-grid">
            {newFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  {file.type.startsWith("image/") ? <FiImage /> : <FiVideo />}
                  <span className="file-name">{file.name}</span>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() => removeNewFile(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      <button type="submit" className="btn-submit">
        Enregistrer les modifications
      </button>
    </form>
  );
};

export default ProductForm;
