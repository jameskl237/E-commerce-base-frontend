import React from "react";
import "./Home.scss";
import { Link } from "react-router-dom";
import Footer from "../../components/Accueil/Footer";
import mascot from "../../assets/Maketa.png";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Bienvenue chez <span>Makétu</span>
          </h1>
          <p>
            La plateforme de commerce en ligne moderne qui connecte les vendeurs
            et les clients facilement et rapidement.
          </p>
          <Link to="/products" className="cta-btn">
            Découvrir
          </Link>
        </div>
        <div className="hero-image">
          <div className="logo-wrapper">
            <img src="/src/assets/Maketu1.jpeg" alt="Makétu logo" />
          </div>
        </div>
      </section>

      {/* Shops Section */}
      <section className="home-section shops-section">
        <div className="home-section-content">
          <h2>Explorez nos boutiques</h2>
          <p>
            Découvrez une variété de boutiques uniques proposant des produits exceptionnels.
            Trouvez vos marques préférées et soutenez les vendeurs locaux.
          </p>
          <Link to="/shops" className="cta-btn">
            Voir les boutiques
          </Link>
        </div>
        <div className="home-section-image">
          <img src={mascot} alt="Mascotte Makétu" />
        </div>
      </section>

      {/* Products Section */}
      <section className="home-section products-section">
        <div className="home-section-image">
          <img src={mascot} alt="Mascotte Makétu" />
        </div>
        <div className="home-section-content">
          <h2>Parcourez nos produits</h2>
          <p>
            Des milliers d'articles vous attendent. Que vous cherchiez quelque chose de
            spécifique ou que vous soyez juste curieux, vous trouverez votre bonheur.
          </p>
          <Link to="/products" className="cta-btn">
            Voir les produits
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
