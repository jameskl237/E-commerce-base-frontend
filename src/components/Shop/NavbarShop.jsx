import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MaketuLogo from '/src/assets/Maketu_logo.png';
import './NavbarShop.scss'; // Import its own styles

const NavbarShop = ({ searchQuery, setSearchQuery, menuLinks }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={MaketuLogo} alt="Makétu Logo" />
        </Link>
      </div>

      {/* Menu links desktop */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {menuLinks.map((link, index) => (
          <li key={index}>
            {link.to ? <Link to={link.to}>{link.label}</Link> : <a href={link.href}>{link.label}</a>}
          </li>
        ))}
      </ul>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>
          <FaSearch />
        </button>
      </div>

      {/* Icons */}
      <div className="nav-icons">
        <button>
          <FaShoppingCart />
        </button>
        <button>
          <FaUser />
        </button>
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default NavbarShop;