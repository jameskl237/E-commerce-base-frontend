import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FiX,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import api from "../../api/api";
import "./ModalAddProduct.scss";

const ModalAddProduct = ({
  isOpen,
  onClose,
  onProductAdded,
  user: propUser,
}) => {
  const { shopId } = useParams();
  const { user: contextUser, loading: authLoading } = useAuth();

  // Utiliser l'utilisateur passé en prop ou celui du contexte
  const user = propUser || contextUser;

  // Extraire les données utilisateur de la structure de réponse API
  const userData = user?.data || user;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    long_description: "",
    price: "",
    promotion_price: "",
    in_stock: true,
    quantity: "",
    origin: "local",
    category: "",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        // Essayer différentes routes possibles pour les catégories
        let response;
        try {
          response = await api.get("/categories");
        } catch {
          try {
            response = await api.get("/product-categories");
          } catch {
            response = await api.get("/api/categories");
          }
        }

        // Adapter selon la structure de réponse de l'API
        const categoriesData = response.data?.data || response.data || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        // En cas d'erreur, utiliser des catégories par défaut
        setCategories([
          { id: 1, name: "Électronique", slug: "electronics" },
          { id: 2, name: "Vêtements", slug: "clothing" },
          { id: 3, name: "Maison & Jardin", slug: "home" },
          { id: 4, name: "Sports & Loisirs", slug: "sports" },
          { id: 5, name: "Beauté & Santé", slug: "beauty" },
          { id: 6, name: "Livres & Médias", slug: "books" },
          { id: 7, name: "Automobile", slug: "automotive" },
          { id: 8, name: "Alimentation", slug: "food" },
          { id: 9, name: "Autre", slug: "other" },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // let parsedValue = value;
    // if (name === "in_stock") {
    //   parsedValue = value === "true" || value === true ? true : false;
    // }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);

    // Vérifier le nombre maximum de fichiers
    if (files.length + newFiles.length > 4) {
      toast.error("Vous ne pouvez ajouter que 4 fichiers maximum");
      return;
    }

    // Vérifier le type de fichier (images et vidéos)
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/ogg",
    ];
    const invalidFiles = newFiles.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error(
        "Seuls les fichiers images (JPEG, PNG, GIF, WebP) et vidéos (MP4, WebM, OGG) sont autorisés"
      );
      return;
    }

    // Vérifier la taille des fichiers (max 10MB par fichier)
    const oversizedFiles = newFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error("La taille maximale par fichier est de 10MB");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // Reset input
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Le prix doit être supérieur à 0";
    if (!formData.quantity || formData.quantity < 0)
      newErrors.quantity = "La quantité doit être positive";
    if (!formData.origin.trim()) newErrors.origin = "L'origine est requise";
    if (!formData.category.trim())
      newErrors.category = "La catégorie est requise";

    // Validation du prix de promotion si fourni
    if (
      formData.promotion_price &&
      parseFloat(formData.promotion_price) >= parseFloat(formData.price)
    ) {
      newErrors.promotion_price =
        "Le prix de promotion doit être inférieur au prix normal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (files.length === 0) {
      toast.error("Veuillez ajouter au moins un fichier (image ou vidéo)");
      return;
    }

    // Debug: Afficher les données utilisateur
    console.log("Données utilisateur complètes:", user);
    console.log("Données utilisateur extraites:", userData);
    console.log("Shop ID:", shopId);
    console.log("Auth loading:", authLoading);

    // Vérifier que les données requises sont présentes
    if (!shopId) {
      toast.error(
        "Erreur: ID du magasin manquant. Assurez-vous que l'URL contient l'ID du magasin."
      );
      return;
    }

    if (authLoading) {
      toast.error("Chargement des données utilisateur...");
      return;
    }

    if (!userData?.id) {
      console.error("Utilisateur non trouvé:", userData);
      toast.error(
        "Erreur: Utilisateur non connecté. Veuillez vous reconnecter."
      );
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Ajouter les données du formulaire
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Ajouter les fichiers
      files.forEach((file, index) => {
        formDataToSend.append(`files[${index}]`, file);
      });

      // Récupérer la catégorie sélectionnée pour obtenir son ID
      const selectedCategory = categories.find(
        (cat) => (cat.slug || cat.name) === formData.category
      );

      // Ajouter les champs requis
      formDataToSend.append("shop_id", shopId);
      formDataToSend.append("user_id", userData.id);
      if (selectedCategory) {
        formDataToSend.append("category_id", selectedCategory.id);
      }

      console.log("Envoi des données:", {
        name: formData.name,
        description: formData.description,
        long_description: formData.long_description,
        price: formData.price,
        promotion_price: formData.promotion_price,
        in_stock: formData.in_stock,
        quantity: formData.quantity,
        origin: formData.origin,
        category: formData.category,
        category_id: selectedCategory?.id,
        shop_id: shopId,
        user_id: userData.id,
        filesCount: files.length,
      });

      const response = await api.post("/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Réponse de l'API:", response);

      if (response.status === 200 || response.status === 201) {
        try {
          toast.success("Produit ajouté avec succès !");
          onProductAdded && onProductAdded();
          handleClose();
        } catch (e) {
          console.error("Erreur lors de l'appel de onProductAdded ou handleClose", e);
          toast.error("Erreur lors de la mise à jour de l'interface.");
        }
      } else {
        toast.error("Erreur inattendue lors de l'ajout du produit");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);

      let errorMessage =
        "Erreur lors de l'ajout du produit. Veuillez réessayer.";

      if (error.code === 'ECONNABORTED') {
        errorMessage = "La requête a expiré. Veuillez vérifier votre connexion internet et réessayer.";
        console.error("Timeout Error:", error.message);
      } else if (error.response) {
        // Erreur de réponse du serveur
        console.error("Erreur de réponse:", error.response.data);

        if (error.response.status === 422) {
          // Erreurs de validation
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
          }
        } else if (error.response.status === 401) {
          errorMessage = "Vous devez être connecté pour ajouter un produit";
        } else if (error.response.status === 403) {
          errorMessage =
            "Vous n'avez pas les permissions pour ajouter un produit";
        } else if (error.response.status === 500) {
          errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
        }
      } else if (error.request) {
        // Erreur de réseau
        console.error("Erreur de réseau:", error.request);
        errorMessage =
          "Erreur de connexion. Vérifiez votre connexion internet.";
      } else {
        // Autre erreur
        console.error("Erreur:", error.message);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      long_description: "",
      price: "",
      promotion_price: "",
      in_stock: true,
      quantity: "",
      origin: "local",
      category: "",
    });
    setFiles([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Afficher un indicateur de chargement si l'utilisateur n'est pas encore chargé
  if (authLoading) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Ajouter un nouveau produit</h2>
            <button className="close-btn" onClick={handleClose}>
              <FiX />
            </button>
          </div>
          <div
            className="modal-form"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <p>Chargement des données utilisateur...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajouter un nouveau produit</h2>
          <button className="close-btn" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nom du produit *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "error" : ""}
                placeholder="Ex: Smartphone Samsung Galaxy"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Prix (FCFA) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={errors.price ? "error" : ""}
                placeholder="Ex: 150000"
                min="0"
                step="25"
              />
              {errors.price && (
                <span className="error-text">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="promotion_price">Prix de promotion (FCFA)</label>
              <input
                type="number"
                id="promotion_price"
                name="promotion_price"
                value={formData.promotion_price}
                onChange={handleInputChange}
                className={errors.promotion_price ? "error" : ""}
                placeholder="Ex: 120000"
                min="0"
                step="25"
              />
              {errors.promotion_price && (
                <span className="error-text">{errors.promotion_price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantité *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={errors.quantity ? "error" : ""}
                placeholder="Ex: 50"
                min="0"
                step="0.1"
              />
              {errors.quantity && (
                <span className="error-text">{errors.quantity}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="origin">Origine *</label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className={errors.origin ? "error" : ""}
              >
                <option value="local">Local</option>
                <option value="imported">Importé</option>
              </select>
              {errors.origin && (
                <span className="error-text">{errors.origin}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? "error" : ""}
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories
                    ? "Chargement des catégories..."
                    : "Sélectionner une catégorie"}
                </option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.slug || category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error-text">{errors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="in_stock">En stock</label>
              <select
                id="in_stock"
                name="in_stock"
                value={formData.in_stock}
                onChange={handleInputChange}
              >
                <option value={true}>Oui</option>
                <option value={false}>Non</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description courte</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description courte du produit..."
              rows="2"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="long_description">Description détaillée</label>
            <textarea
              id="long_description"
              name="long_description"
              value={formData.long_description}
              onChange={handleInputChange}
              placeholder="Description détaillée du produit..."
              rows="4"
            />
          </div>

          <div className="file-upload-section">
            <label className="file-upload-label">
              <FiUpload className="upload-icon" />
              <span>Ajouter des images ou vidéos</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="file-input"
                disabled={files.length >= 4}
              />
            </label>
            <p className="file-info">
              Maximum 4 fichiers (images ou vidéos), 10MB par fichier
            </p>
          </div>

          {files.length > 0 && (
            <div className="files-preview">
              <h4>Fichiers sélectionnés ({files.length}/4)</h4>
              <div className="files-grid">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      {file.type.startsWith("image/") ? (
                        <FiImage className="file-icon" />
                      ) : (
                        <FiVideo className="file-icon" />
                      )}
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || files.length === 0}
            >
              {loading ? "Ajout en cours..." : "Ajouter le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddProduct;