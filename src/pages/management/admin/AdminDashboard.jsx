// src/pages/management/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiPackage, FiGrid, FiDollarSign, FiBarChart2 } from "react-icons/fi";
import AdminPageLayout from "../../../components/management/AdminPageLayout";

const AdminDashboard = () => {
  const managementCards = [
    {
      title: "Gestion des Utilisateurs",
      description: "Gérer les comptes utilisateurs, droits et permissions",
      icon: <FiUsers className="card-icon" />,
      path: "/admin/userManagement",
      color: "#4F46E5"
    },
    {
      title: "Gestion des Fournisseurs",
      description: "Gérer les comptes fournisseurs et leurs boutiques",
      icon: <FiShoppingBag className="card-icon" />,
      path: "/admin/suppliers",
      color: "#10B981"
    },
    {
      title: "Gestion des Produits",
      description: "Gérer tous les produits de la plateforme",
      icon: <FiPackage className="card-icon" />,
      path: "/admin/products",
      color: "#F59E0B"
    },
    {
      title: "Gestion des Boutiques",
      description: "Gérer toutes les boutiques de la plateforme",
      icon: <FiShoppingBag className="card-icon" />,
      path: "/admin/shops",
      color: "#EF4444"
    },
    {
      title: "Gestion des Catégories",
      description: "Gérer les catégories de produits",
      icon: <FiGrid className="card-icon" />,
      path: "/admin/categories",
      color: "#8B5CF6"
    },
    {
      title: "Gestion des Commandes",
      description: "Suivre et gérer les commandes clients",
      icon: <FiDollarSign className="card-icon" />,
      path: "/admin/orders",
      color: "#06B6D4"
    },
    {
      title: "Tableau de Bord",
      description: "Statistiques et rapports de la plateforme",
      icon: <FiBarChart2 className="card-icon" />,
      path: "/admin/analytics",
      color: "#8B5CF6"
    }
  ];

  return (
    <AdminPageLayout
      title="Tableau de Bord Administrateur"
      subtitle="Bienvenue dans votre espace d'administration"
      showBackButton={false}
    >
      <div className="dashboard-grid">
        {managementCards.map((card, index) => (
          <Link key={index} to={card.path} className="management-card">
            <div className="card-content">
              <div className="card-icon-container" style={{ backgroundColor: `${card.color}20` }}>
                {card.icon}
              </div>
              <div className="card-text">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminPageLayout>
  );
};

export default AdminDashboard;
