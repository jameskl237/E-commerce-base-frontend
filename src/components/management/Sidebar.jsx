// src/components/Sidebar.jsx
import React from "react";
import useAuth from "../auth/useAuth";
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";

const items = {
  administrator: [
    { to: "/admin/dashboard", label: "Tableau de bord" },
    { to: "/admin/suppliers", label: "Fournisseurs" },
    { to: "/admin/stores", label: "Boutiques" },
    { to: "/admin/products", label: "Produits" },
    { to: "/admin/orders", label: "Commandes" },
    { to: "/admin/settings", label: "Paramètres" },
  ],
  supplier: [
    { to: "/supplier/dashboard", label: "Tableau de bord" },
    { to: "/supplier/products", label: "Mes produits" },
    { to: "/supplier/orders", label: "Mes commandes" },
    { to: "/supplier/store", label: "Ma boutique" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "supplier";
  const list = items[role] || [];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {list.map(i => (
            <li key={i.to}>
              <NavLink to={i.to} className={({isActive}) => isActive ? "active" : ""}>{i.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
