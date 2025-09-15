import React from "react";
import "./Home.scss";
import { Link } from "react-router-dom";
import Footer from "../../components/Accueil/Footer"; // Assure-toi que ton Footer est dans src/components/Footer.jsx

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
            La plateforme e-commerce moderne qui connecte les vendeurs et les
            clients facilement et rapidement.
          </p>
          <Link to="/products" className="cta-btn">
            Découvrir
          </Link>
        </div>
        <div className="hero-image">
          <div className="logo-wrapper">
            <img src="/src/assets/Maketu_logo.png" alt="Makétu logo" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Pourquoi choisir Makétu ?</h2>
        <p>
          Makétu révolutionne le e-commerce en offrant une plateforme simple,
          moderne et sécurisée. Que vous soyez vendeur ou acheteur, notre
          objectif est de rendre vos transactions fluides et agréables.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Nos Atouts</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Rapidité</h3>
            <p>Une navigation fluide et des paiements sécurisés en un clic.</p>
          </div>
          <div className="feature-card">
            <h3>📦 Variété</h3>
            <p>Un large choix de produits pour tous les besoins.</p>
          </div>
          <div className="feature-card">
            <h3>🤝 Confiance</h3>
            <p>Des vendeurs certifiés et un service client à votre écoute.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
