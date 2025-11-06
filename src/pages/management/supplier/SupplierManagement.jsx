// src/pages/supplier/SupplierDashboard.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // 👈 import
import useAuth from "../../../auth/useAuth";
import api from "../../../api/api";
import { FiPlus, FiSearch, FiEdit, FiTrash } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SupplierLayout from "../../../components/management/SupplierLayout";
import ModalAddProduct from "../../../components/management/ModalAddProduct";
import ModalConfirmation from "../../../components/management/ModalConfirmation";
import { useTheme } from "../../../context/ThemeContext";

function SupplierDashboardContent() {
  const { darkMode } = useTheme();
  const { shopId } = useParams(); // 👈 récupérer l'id depuis l'URL
  const { user } = useAuth(); // 👈 récupérer l'utilisateur connecté
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    productId: null,
  });

  useEffect(() => {
    if (shopId) {
      fetchProducts(shopId);
    }
  }, [shopId]);

  const fetchProducts = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/shops/${id}`); // 👈 remplacer :shopId par la vraie valeur
      const data = res.data?.products || [];
      setProducts(data);
    } catch (err) {
      console.error("Erreur récupération produits", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // modal de confirmation avant suppression

  const confirmationModalHandler = (id) => {
    setConfirmationModal({
      isOpen: true,
      productId: id,
      title: "Confirmer la suppression",
      message:
        "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
      onConfirm: () => {
        handleDelete(id);
        setConfirmationModal({ isOpen: false, productId: null });
      },
      onCancel: () => setConfirmationModal({ isOpen: false, productId: null }),
    });
  };

  //---------------------------------------------------------------

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id != id));
      toast.success('Produit supprimé avec succès');
    } catch (err) {
      console.error("Erreur suppression", err);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  const handleProductAdded = () => {
    // Rafraîchir la liste des produits après ajout
    if (shopId) {
      fetchProducts(shopId);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();
    // Parcourir toutes les valeurs de l'objet produit
    for (const key in product) {
      if (Object.prototype.hasOwnProperty.call(product, key)) {
        const value = product[key];
        // Vérifier si la valeur existe et si elle inclut le terme de recherche
        if (value && value.toString().toLowerCase().includes(searchTerm)) {
          return true; // Si une correspondance est trouvée, inclure le produit
        }
      }
    }
    return false; // Si aucune correspondance n'est trouvée, exclure le produit
  });

  return (
    <>
      <ToastContainer />
      <header className="dashboard-header">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Ajouter produit
        </button>
      </header>

      {loading ? (
        <p>Chargement des produits...</p>
      ) : filteredProducts.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Code</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Origine</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.code}</td>
                  <td>{p.price} FCFA</td>
                  <td>{p.in_stock ? "✅ Oui" : "❌ Non"}</td>
                  <td>{p.origin}</td>
                  <td className="actions">
                    <Link to={`/supplier/product/edit/${p.id}`} className="icon-btn edit">
                      <FiEdit />
                    </Link>

                    <button
                      className="icon-btn delete"
                      onClick={() => confirmationModalHandler(p.id)} // 👈 ici tu appelles ta modal
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalAddProduct
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
        user={user} // 👈 passer l'utilisateur connecté
      />

      <ModalConfirmation
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={confirmationModal.onCancel}
        isDarkMode={darkMode}
      />
    </>
  );
}

export default function SupplierDashboard() {
    return (
        <SupplierLayout>
            <div className="dashboard-content-wrapper">
                <SupplierDashboardContent />
            </div>
        </SupplierLayout>
    )
}