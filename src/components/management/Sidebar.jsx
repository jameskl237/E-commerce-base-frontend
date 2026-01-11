import React from "react";
import useAuth from "../../auth/useAuth";
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";

const items = {
  administrator: [
    // { to: "/admin/dashboard", label: "Tableau de bord" },
    { to: "/admin/suppliers", label: "Fournisseurs" },
    { to: "/admin/stores", label: "Boutiques" },
    { to: "/admin/products", label: "Produits" },
    { to: "/admin/orders", label: "Commandes" },
    { to: "/admin/settings", label: "Paramètres" },
  ],
  supplier: [
    // { to: "/supplier/dashboard", label: "Tableau de bord" },
    { to: "/supplier/shops/dashboard", label: "Mes Boutiques" },
    { to: "/supplier/orders", label: "Mes commandes" },
    { to: "/supplier/store", label: "Ma boutique" },
  ],
};

export default function Sidebar({ isOpen, closeSidebar, navHeight }) {
  const { user } = useAuth();
  // Normaliser le rôle : mapper "admin" à "administrator" pour correspondre aux clés dans items
  // Gérer différentes variantes (insensible à la casse)
  const userRole = user?.role?.toLowerCase() || "supplier";
  const normalizedRole = userRole === "admin" || userRole === "administrator" ? "administrator" : "supplier";
  const list = items[normalizedRole] || [];

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      style={{ top: navHeight ? `${navHeight}px` : "60px", height: `calc(100vh - ${navHeight}px)` }}
    >
      <nav>
        <ul>
          {list.map(i => (
            <li key={i.to}>
              <NavLink to={i.to} className={({ isActive }) => isActive ? "active" : ""}>{i.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </aside>
  );
}

