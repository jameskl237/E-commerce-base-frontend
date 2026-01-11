import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.scss';
import Navbar from '../../components/Accueil/Navbar';
import Footer from '../../components/Accueil/Footer';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Helper: extract supplier phone from item
  // Structure: Product -> Shop
  // Le numéro est celui de la boutique (shop)
  // Relation: Product belongsTo Shop (shop_id), Shop a un attribut phone
  const getSupplierPhone = (item) => {
    console.log('🔍 [getSupplierPhone] Item structure:', {
      itemId: item.id,
      itemName: item.name,
      shop: item.shop,
      shopId: item.shop?.id,
      shopName: item.shop?.name,
      shopPhone: item.shop?.phone,
    });
    
    // Afficher la structure complète du shop pour voir tous les attributs disponibles
    console.log('🏪 [getSupplierPhone] Full shop object:', JSON.stringify(item.shop, null, 2));
    console.log('🏪 [getSupplierPhone] Shop keys:', item.shop ? Object.keys(item.shop) : 'no shop');
    
    // Le numéro de téléphone de la boutique (shop)
    // Structure: product.shop.phone
    const phone = item.shop?.phone || null;
    
    if (phone) {
      console.log('✅ [getSupplierPhone] Phone found:', phone, 'for item:', item.name, '(shop:', item.shop?.name || 'unknown', ')');
    } else {
      console.log('❌ [getSupplierPhone] No phone found for item:', item.name);
      console.log('❌ [getSupplierPhone] Missing data:', {
        hasShop: !!item.shop,
        hasPhone: !!item.shop?.phone,
        shopStructure: item.shop ? 'Shop exists but phone is missing' : 'Shop is missing',
      });
      
      // Vérifier si le phone est peut-être sous un autre nom ou chemin
      if (item.shop) {
        console.log('🔎 [getSupplierPhone] Checking alternative phone paths...');
        console.log('   - item.shop.phone:', item.shop.phone);
        console.log('   - item.shop.telephone:', item.shop.telephone);
        console.log('   - item.shop.mobile:', item.shop.mobile);
        console.log('   - item.shop.contact:', item.shop.contact);
        console.log('   - item.shop.contact_phone:', item.shop.contact_phone);
      }
    }
    
    return phone;
  };

  // Normalise le numéro pour WhatsApp: garde uniquement les chiffres, supprime zéros initiaux.
  // IMPORTANT: Le numéro doit être au format international (indicatif pays + numéro)
  // Format requis pour WhatsApp wa.me: indicatif pays + numéro (chiffres uniquement, sans le signe +)
  // Exemple: 237123456789 (Cameroun), 33123456789 (France), 221123456789 (Sénégal)
  // Retourne null si le numéro semble invalide (trop court).
  const normalizePhone = (raw) => {
    console.log('🔢 [normalizePhone] Raw phone number:', raw);
    if (!raw) {
      console.log('❌ [normalizePhone] No raw phone number provided');
      return null;
    }
    const digits = String(raw).replace(/\D+/g, '');
    console.log('🔢 [normalizePhone] Digits only:', digits);
    if (!digits) {
      console.log('❌ [normalizePhone] No digits found');
      return null;
    }
    // retire les zéros initiaux (si présent) — l'utilisateur doit fournir l'indicatif pays
    const cleaned = digits.replace(/^0+/, '');
    console.log('🔢 [normalizePhone] After removing leading zeros:', cleaned, 'length:', cleaned.length);
    // heuristique: numéro trop court => invalide (minimum 8 chiffres après nettoyage)
    // Note: Un numéro international valide fait généralement 10-15 chiffres
    if (cleaned.length < 8) {
      console.log('❌ [normalizePhone] Phone number too short (min 8 digits):', cleaned.length);
      return null;
    }
    console.log('✅ [normalizePhone] Normalized phone:', cleaned);
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
    return lines.join('\n');
  };

  const handleCheckout = () => {
    console.log('🛒 [handleCheckout] Starting checkout with cartItems:', cartItems);
    console.log('🛒 [handleCheckout] Number of items in cart:', cartItems.length);
    
    if (!cartItems || cartItems.length === 0) {
      toast.warn("Le panier est vide.");
      return;
    }

    // Afficher la structure complète de chaque item
    console.log('📦 [handleCheckout] Full cart items structure:');
    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item.id,
        name: item.name,
        fullStructure: item,
        shop: item.shop,
        shopUser: item.shop?.user,
      });
    });

    // Regrouper par fournisseur (numéro)
    console.log('📞 [handleCheckout] Grouping items by supplier phone...');
    const byPhone = cartItems.reduce((acc, item) => {
      const raw = getSupplierPhone(item);
      const phone = normalizePhone(raw);
      console.log(`📞 [handleCheckout] Item "${item.name}": raw=${raw}, normalized=${phone}`);
      if (!phone) {
        acc.__missing__ = acc.__missing__ || [];
        acc.__missing__.push(item);
        console.log(`⚠️ [handleCheckout] Item "${item.name}" has no valid phone, added to missing`);
      } else {
        acc[phone] = acc[phone] || [];
        acc[phone].push(item);
        console.log(`✅ [handleCheckout] Item "${item.name}" grouped under phone: ${phone}`);
      }
      return acc;
    }, {});

    console.log('📊 [handleCheckout] Grouped by phone:', byPhone);
    console.log('📊 [handleCheckout] Missing phones:', byPhone.__missing__?.length || 0);

    if (byPhone.__missing__ && byPhone.__missing__.length > 0) {
      const names = byPhone.__missing__.map((p) => p.name).join(', ');
      const proceed = window.confirm(
        `Certains produits n'ont pas de numéro fournisseur valide: ${names}.\nContinuer pour les autres fournisseurs ?`
      );
      if (!proceed) return;
    }

    const phones = Object.keys(byPhone).filter((k) => k !== '__missing__');
    console.log('📱 [handleCheckout] Valid phone numbers found:', phones);
    console.log('📱 [handleCheckout] Number of suppliers:', phones.length);
    
    if (phones.length === 0) {
      console.error('❌ [handleCheckout] No valid phone numbers found!');
      toast.error("Aucun numéro fournisseur valide trouvé pour les produits du panier.");
      return;
    }

    // Ouvre une conversation WhatsApp par fournisseur (séquentiellement pour réduire le blocage pop-up)
    phones.forEach((phone, idx) => {
      const products = byPhone[phone];
      console.log(`📤 [handleCheckout] Preparing WhatsApp message for phone ${phone}:`, {
        phone: phone,
        productsCount: products.length,
        products: products.map(p => p.name),
      });
      const msg = composeMessage(products);
      const wa = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      console.log(`📤 [handleCheckout] WhatsApp URL for ${phone}:`, wa);
      setTimeout(() => {
        console.log(`🌐 [handleCheckout] Opening WhatsApp for phone: ${phone}`);
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
            <Link to="/products" className="btn btn-black btn-back">Continuer vos achats</Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-info">
                    <img src={item.medias && item.medias.length > 0 ? `https://maketubackend.srv696182.hstgr.cloud//storage/${item.medias[0].url}`: "/src/assets/Maketu1.jpeg"} alt={item.name} />
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