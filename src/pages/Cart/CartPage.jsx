import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.scss';
import Navbar from '../../components/Accueil/Navbar';
import Footer from '../../components/Accueil/Footer';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Helper: extract supplier phone from item (adapte si ta structure diffère)
  const getSupplierPhone = (item) =>
    item.shop?.phone ||
    item.supplier?.phone ||
    item.supplierPhone ||
    item.vendorPhone ||
    item.shopPhone ||
    null;

  // Normalise le numéro: garde uniquement les chiffres, supprime zéros initiaux.
  // Retourne null si le numéro semble invalide (trop court).
  const normalizePhone = (raw) => {
    if (!raw) return null;
    const digits = String(raw).replace(/\D+/g, '');
    if (!digits) return null;
    // retire les zéros initiaux (si présent) — l'utilisateur doit fournir l'indicatif pays
    const cleaned = digits.replace(/^0+/, '');
    // heuristique: numéro trop court => invalide
    if (cleaned.length < 8) return null;
    return cleaned;
  };

  const composeMessage = (products) => {
    const lines = [
      "Nouvelle commande reçue :",
      "",
      ...products.map(
        (p, i) =>
          `${i + 1}. ${p.name}${p.quantity ? ` x${p.quantity}` : ''}${p.price ? ` — ${p.price} FCFA` : ''}`
      ),
      "",
      "Merci de confirmer la disponibilité et le délai de livraison.",
    ];
    return lines.join('\n');
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.warn("Le panier est vide.");
      return;
    }

    // Regrouper par fournisseur (numéro)
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

    // Ouvre une conversation WhatsApp par fournisseur (séquentiellement pour réduire le blocage pop-up)
    phones.forEach((phone, idx) => {
      const products = byPhone[phone];
      const msg = composeMessage(products);
      const wa = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      setTimeout(() => {
        window.open(wa, '_blank');
      }, idx * 600);
    });

    // Optionnel : vider le panier après ouverture des liens
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
            <Link to="/products" className="btn btn-primary">Continuer vos achats</Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
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