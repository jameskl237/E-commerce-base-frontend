import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartDropdown.scss";

const CartDropdown = () => {
  const { cartItems = [] } = useCart();

  if (!cartItems.length) {
    return (
      <div className="cart-dropdown empty">
        <div className="empty-msg">Votre panier est vide</div>
        <Link to="/cart" className="view-cart-btn">Voir le panier</Link>
      </div>
    );
  }

  const marqueeText = cartItems
    .map((it) => `${it.name}${it.quantity && it.quantity > 1 ? ` x${it.quantity}` : ""}`)
    .join("  •  ");

  return (
    <div className="cart-dropdown" role="dialog" aria-label="Panier">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__inner">{marqueeText}</div>
      </div>

      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.id || item.productId || item.name} className="cart-item">
            <span className="item-name">{item.name}</span>
            <span className="item-qty">x{item.quantity || 1}</span>
          </li>
        ))}
      </ul>

      <Link to="/cart" className="view-cart-btn">Voir le panier</Link>
    </div>
  );
};

export default CartDropdown;
