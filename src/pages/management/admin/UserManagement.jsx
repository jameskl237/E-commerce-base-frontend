import React, { useState, useEffect } from "react";
import { FiUser, FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import AdminNoSidebarLayout from "../../../components/management/AdminNoSidebarLayout";
import ModalConfirmation from "../../../components/management/ModalConfirmation";
import api from "../../../api/api";
import { toast } from "react-toastify";
import "./UserManagement.scss";
  
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const usersPerPage = 10;

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data.data || response.data); // Handle both paginated and non-paginated responses
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Check theme from localStorage or system preference
    const darkModePref = localStorage.getItem('theme') === 'dark' ||
                         (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkModePref);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate filtered users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPagesCalculated = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/users/${userToDelete.id}`);
      toast.success(`Utilisateur "${userToDelete.name}" supprimé avec succès`);
      fetchUsers(); // Refresh the list
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <AdminNoSidebarLayout>
      <div className="admin-dashboard">
        <div className="admin-header">
          <Link to="/admin/dashboard" className="back-button">
            <FiArrowLeft className="back-icon" />
            <span>Retour</span>
          </Link>

          <div className="header-main">
            <div className="title-block">
              <h1>Gestion des Utilisateurs</h1>
              <p>Gérer les comptes utilisateurs, droits et permissions</p>
            </div>

            <div className="controls-row">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={clearSearch}>
                    <FiX />
                  </button>
                )}
              </div>

              <button className="btn-add" onClick={() => toast.info("Ajouter utilisateur")}>
                <FiPlus />
                <span>Ajouter Utilisateur</span>
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Identifiant</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.address || "-"}</td>
                    <td className="actions">
                      <button
                        className="icon-btn edit"
                        title="Modifier"
                        onClick={() => {
                          // Handle edit action
                          toast.info("Fonctionnalité de modification en développement");
                        }}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="icon-btn delete"
                        title="Supprimer"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPagesCalculated > 1 && (
          <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              {Array.from({ length: totalPagesCalculated }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={currentPage === number ? 'active' : ''}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPagesCalculated}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        <ModalConfirmation
          isOpen={showDeleteModal}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete?.name}" ? Cette action est irréversible.`}
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
          isDarkMode={isDarkMode}
        />
      </div>
    </AdminNoSidebarLayout>
  );
};

export default UserManagement;