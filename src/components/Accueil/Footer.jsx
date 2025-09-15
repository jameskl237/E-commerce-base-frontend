import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* À propos */}
        <div className="footer-section">
          <h3>À propos</h3>
          <p>
            Makétu est une plateforme moderne qui vous connecte aux meilleurs
            produits et services. Notre mission est de rendre vos achats plus
            simples et agréables.
          </p>
        </div>

        {/* Liens rapides */}
        <div className="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/shop">Boutique</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email : contact@maketu.com</p>
          <p>Tél : +237 6 95 98 988 79</p>
          <p>Adresse : Yaoundé, Cameroun</p>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Makétu. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
