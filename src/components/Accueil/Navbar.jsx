import "./Navbar.scss";
import logo from "../../assets/Maketu1.jpeg"; // Mets le fichier dans src/assets/
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "../Cart/CartDropdown";

function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for menu
  const cartRef = useRef(null);
  const menuRef = useRef(null); // ref for the mobile menu dropdown

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartVisible((v) => !v);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation(); // empêche le handler global de fermer immédiatement
    setIsMenuOpen((v) => !v);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartVisible && cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartVisible(false);
      }
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isCartVisible, isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <div className="logo-circle">
            <img src={logo} alt="Makétu Logo" />
          </div>
          <span className="maketu">Makétu</span>
        </Link>
      </div>
      <ul ref={menuRef} className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li onClick={() => setIsMenuOpen(false)}>
          <Link to="/">Accueil</Link>
        </li>
        <li onClick={() => setIsMenuOpen(false)}>
          <Link to="/shops">Boutiques</Link>
        </li>

        <li ref={cartRef} className="cart-item">
          <button className="cart-link" onClick={(e) => handleCartClick(e)}>
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
          {isCartVisible && <CartDropdown />}
        </li>

        <li onClick={() => setIsMenuOpen(false)}>
          <Link to="/login">Connexion</Link>
        </li>
      </ul>

      <div className="menu-icon" onClick={(e) => handleMenuClick(e)}>
        <FaBars />
      </div>
    </nav>
  );
}

export default Navbar;
