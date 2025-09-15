import React, { useState } from "react";
import {
  FaSearch,
  FaBars,
  FaUserCircle,
  FaInfoCircle,
  FaCog,
  FaShoppingCart,
  FaStore,
} from "react-icons/fa";

const Navbar = ({ shop }) => {
  // declaration des states

  const [menuOpen, setMenuOpen] = useState(false);

  // comportemets

  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      // Vérifie si le clic est en dehors du menu et du bouton
      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".menu-btn")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // affichage

  return (
    <nav className="navbar">
      <div className="logo">
        <FaStore className="store-icon" />
        {shop?.name || "Boutique"}
      </div>

      {/* Barre de recherche */}
      <div className="search-bar">
        <input type="text" placeholder="Rechercher un produit..." />
        <button>
          <FaSearch />
        </button>
      </div>

      {/* Icônes */}
      <div className="nav-icons">
        <button className="cart-btn">
          <FaShoppingCart />
          {/* <span className="cart-count">0</span> */}
        </button>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
        {menuOpen && (
          <div className="dropdown-menu">
            <a href="#">
              <FaInfoCircle /> À propos
            </a>
            <a href="#">
              <FaCog /> Paramètres
            </a>
            <a href="/login">
              <FaUserCircle /> Gestion
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
