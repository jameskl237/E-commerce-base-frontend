// src/pages/supplier/SupplierDashboard.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 👈 import
import useAuth from "../../../auth/useAuth";
import api from "../../../api/api";
import { FiPlus, FiSearch, FiEdit, FiTrash } from "react-icons/fi";
import SupplierLayout from "../../../components/management/SupplierLayout";
import ModalAddProduct from "../../../components/management/ModalAddProduct";
import ModalConfirmation from "../../../components/management/ModalConfirmation";

export default function SupplierDashboard() {
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
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  const handleProductAdded = () => {
    // Rafraîchir la liste des produits après ajout
    if (shopId) {
      fetchProducts(shopId);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SupplierLayout>
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
                    <button className="icon-btn edit">
                      <FiEdit />
                    </button>

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
        isDarkMode={false} // ou une variable d’état si tu as un switch dark mode
      />
      
    </SupplierLayout>
  );
}
