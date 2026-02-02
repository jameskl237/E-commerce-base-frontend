import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import MaketuLogo from '/src/assets/Maketu1.jpeg';
import './NavbarShop.scss'; // Import its own styles
import { useCart } from '../../context/CartContext';
import CartDropdown from '../Cart/CartDropdown';

const NavbarShop = ({ searchQuery, setSearchQuery, menuLinks }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const cartRef = useRef(null);

  // Get the current location
  const location = useLocation();

  // Determine the correct link for the user icon
  const userIconLink = location.pathname.startsWith('/shop/')
    ? '/login'
    : '/supplier/register';

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartVisible(!isCartVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartRef]);

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
            { (link.href && (link.href.startsWith('http') || link.href.startsWith('//')))
              ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
              : <Link to={link.to || link.href}>{link.label}</Link>
            }
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
        <li ref={cartRef}>
          <button type="button" className="cart-link" onClick={handleCartClick}>
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
          {isCartVisible && <CartDropdown />}
        </li>
        <Link to={userIconLink} className="nav-icon-link">
          <FaUser />
        </Link>
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default NavbarShop;