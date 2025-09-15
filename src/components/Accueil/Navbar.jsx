import "./Navbar.scss";
import logo from "../assets/Maketu_logo.png"; // Mets le fichier dans src/assets/

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <div className="logo-circle">
          <img src={logo} alt="Makétu Logo" />
        </div>
        <span className="maketu">Makétu</span>
      </div>
      <ul className="nav-links">
        <li><a href="/">Accueil</a></li>
        <li><a href="/shop">Boutique</a></li>
        <li><a href="/cart">Panier</a></li>
        <li><a href="/login">Connexion</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
