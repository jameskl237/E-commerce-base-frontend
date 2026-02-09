import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.scss';
import Navbar from '../../components/Accueil/Navbar';
import Footer from '../../components/Accueil/Footer';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/constants';

const FRONTEND_URL = window.location.origin;

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const getProductImage = (item) => {
    if (item.medias && item.medias.length > 0) {
      return `${API_BASE_URL}/storage/${item.medias[0].url}`;
    }
    return `${FRONTEND_URL}/Maketu_panier.png`;
  };

  const getSupplierPhone = (item) => {
    const phone = item.shop?.phone || null;
    if (!phone) {
      console.log('No phone found for item:', item.name);
    }
    return phone;
  };

  const normalizePhone = (raw) => {
    if (!raw) return null;
    const digits = String(raw).replace(/\D+/g, '');
    const cleaned = digits.replace(/^0+/, '');
    if (cleaned.length < 8) return null;
    return cleaned;
  };

  const composeMessage = (products) => {
    const items = products.map(
      (p, i) => {
        const totalPrice = (p.price || 0) * (p.quantity || 1);
        return `${i + 1}. ${p.name}${p.quantity ? ` x${p.quantity}` : ''} — ${totalPrice} FCFA`;
      }
    );
    
    const total = products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0);
    
    const lines = [
      "Nouvelle commande reçue :",
      "",
      ...items,
      "",
      `Total: ${total} FCFA`,
      "",
      "Merci de confirmer la disponibilité et le délai de livraison.",
    ];

    if (import.meta.env.PROD) {
      const firstImage = getProductImage(products[0]);
      lines.unshift(firstImage, "");
    }

    return lines.join('\n');
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.warn("Le panier est vide.");
      return;
    }

    const byPhone = cartItems.reduce((acc, item) => {
      const raw = getSupplierPhone(item);
      const phone = normalizePhone(raw);
      if (!phone) {
        acc.__missing__ = acc.__missing__ || [];
        acc.__missing__.push(item);
      } else {
        acc[phone] = acc[phone] || [];
        acc[phone].push(item);
      }
      return acc;
    }, {});

    if (byPhone.__missing__ && byPhone.__missing__.length > 0) {
      const names = byPhone.__missing__.map((p) => p.name).join(', ');
      const proceed = window.confirm(
        `Certains produits n'ont pas de numéro fournisseur valide: ${names}.\nContinuer pour les autres fournisseurs ?`
      );
      if (!proceed) return;
    }

    const phones = Object.keys(byPhone).filter((k) => k !== '__missing__');
    
    if (phones.length === 0) {
      toast.error("Aucun numéro fournisseur valide trouvé pour les produits du panier.");
      return;
    }

    phones.forEach((phone, idx) => {
      const products = byPhone[phone];
      const msg = composeMessage(products);
      const wa = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      setTimeout(() => {
        window.open(wa, '_blank');
      }, idx * 600);
    });

    setTimeout(() => {
      clearCart();
      toast.success('Liens WhatsApp ouverts pour chaque fournisseur. Le panier a été vidé.');
    }, phones.length * 700 + 300);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h1>Votre Panier</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Votre panier est vide.</p>
            <Link to="/products" className="btn btn-black btn-back">Continuer vos achats</Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-info">
                    <img src={getProductImage(item)} alt={item.name} />
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
              <button className="btn btn-success btn-checkout" onClick={handleCheckout}>
                Passer la commande
              </button>
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
