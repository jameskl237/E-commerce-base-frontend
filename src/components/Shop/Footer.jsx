import React from "react";

const Footer = ({ shop }) => (
  <footer className="shop-footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>À propos de {shop?.name || "notre boutique"}</h3>
        <p>{shop?.description || "Boutique en ligne offrant des produits de qualité."}</p>
      </div>
      <div className="footer-section">
        <h3>Contact</h3>
        <p>{shop?.email || "contact@boutique.com"}</p>
        <p>{shop?.phone || "+237 XX XXX XX XX"}</p>
      </div>
      <div className="footer-section">
        <h3>Adresse</h3>
        <p>{shop?.address || "Dakar, Sénégal"}</p>
      </div>
    </div>
    <div className="footer-bottom">
        <p>© 2025 Makétu. Tous droits réservés.</p>
      </div>
  </footer>
);

export default Footer;
