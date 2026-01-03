import "./Navbar.scss";
import logo from "../../assets/Maketu1.jpeg"; // Mets le fichier dans src/assets/
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "../Cart/CartDropdown";

function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const cartRef = useRef(null);

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
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <div className="logo-circle">
            <img src={logo} alt="Makétu Logo" />
          </div>
          <span className="maketu">Makétu</span>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/shops">Boutiques</Link></li>
        <li ref={cartRef}>
          <a href="/cart" className="cart-link" onClick={handleCartClick}>
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </a>
          {isCartVisible && <CartDropdown />}
        </li>
        <li><Link to="/login">Connexion</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
