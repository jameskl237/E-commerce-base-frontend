import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.scss';
import Navbar from '../../components/Accueil/Navbar';
import Footer from '../../components/Accueil/Footer';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1>Votre Panier</h1>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Votre panier est vide.</p>
            <Link to="/products" className="btn btn-primary">Continuer vos achats</Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-info">
                    <img src={item.medias && item.medias.length > 0 ? `http://localhost:8000/storage/${item.medias[0].url}`: "/src/assets/default.jpg"} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.price} FCFA</p>
                    </div>
                  </div>
                  <div className="item-controls">
                    <p>Quantité: {item.quantity}</p>
                    <button onClick={() => removeFromCart(item)} className="btn btn-danger">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Résumé de la commande</h2>
              <div className="summary-total">
                <span>Total</span>
                <span>{getTotalPrice()} FCFA</span>
              </div>
              <button className="btn btn-success btn-checkout">Passer la commande</button>
              <button onClick={clearCart} className="btn btn-outline">Vider le panier</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;