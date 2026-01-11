import "./Footer.scss";
import { FaFacebookF,FaWhatsapp, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

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
            {/* <li><a href="/about">À propos</a></li>
            <li><a href="/contact">Contact</a></li> */}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          {/* <p>Email : contact@maketu.com</p> */}
          <p>Tél : +237 6 95 98 988 79</p>
          <p>Adresse : Yaoundé, Cameroun</p>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/share/1KYupr5FCp/?mibextid=wwXIfr" aria-label="Facebook" className="social-link"><FaFacebookF /></a>
            <a href="https://whatsapp.com/channel/0029VbBpVyo545v2xLJpev2X" aria-label="WhatsApp" className="social-link"><FaWhatsapp /></a>
            {/* <a href="#" aria-label="Twitter" className="social-link"><FaTwitter /></a>
            <a href="#" aria-label="Instagram" className="social-link"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" className="social-link"><FaLinkedinIn /></a> */}
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
