import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Accueil/Footer';

// Main mascot for hero
import mascotHero from '../../assets/Maketa.png';

// New mascot images for feature sections
const mascotPanier = '/Maketu_panier.png';
import mascotOrdi from '../../assets/Maketu_ordi.png';
import mascotCoeur from '../../assets/Maketu_coeur.png';
import mascotPhone from '../../assets/Maketu_phone.png';

import './Home.scss';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="animate-fade-in-down">Votre marché en ligne, <br /> simple et local.</h1>
          <p className="animate-fade-in-up">Trouvez tout ce dont vous avez besoin, des produits faits main aux dernières technologies, tout en soutenant les vendeurs près de chez vous.</p>
          <div className="hero-cta animate-fade-in-up">
            <Link to="/products" className="btn-primary">Explorer</Link>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={mascotHero} alt="Mascotte Makétu" className="hero-mascot animate-float" />
        </div>
      </section>

      {/* Feature Section 1: Shopping */}
      <section className="feature-section">
        <div className="feature-image">
          <img src={mascotPanier} alt="Mascotte Makétu avec un panier" />
        </div>
        <div className="feature-content">
          <h2>Faites votre shopping en toute simplicité</h2>
          <p>Parcourez nos boutiques, ajoutez vos articles préférés au panier et profitez d'un processus de commande fluide et sécurisé.</p>
          <Link to="/products" className="btn-secondary">Explorer les produits</Link>
        </div>
      </section>

      {/* Feature Section 2: Selling (layout reversed) */}
      <section className="feature-section feature-section-reverse">
        <div className="feature-content">
          <h2>Vendez vos créations, touchez plus de clients</h2>
          <p>Ouvrez votre boutique en quelques clics et gérez vos produits, vos commandes et vos clients depuis un tableau de bord intuitif.</p>
          <Link to="/supplier/register" className="btn-secondary">Devenir vendeur</Link>
        </div>
        <div className="feature-image">
          <img src={mascotOrdi} alt="Mascotte Makétu avec un ordinateur" />
        </div>
      </section>

      {/* Feature Section 3: Wishlist */}
      <section className="feature-section">
        <div className="feature-image">
          <img src={mascotCoeur} alt="Mascotte Makétu avec un coeur" />
        </div>
        <div className="feature-content">
          <h2>Consultez la liste de nos boutiques</h2>
          <p>Consultez la liste de nos boutiques et trouvez les meilleurs produits pour votre entreprise.</p>
          <Link to="/shops" className="btn-secondary">Nos boutiques</Link>
        </div>
      </section>

      {/* Feature Section 4: Mobile (layout reversed) */}
      <section className="feature-section feature-section-reverse">
        <div className="feature-content">
          <h2>Makétu, toujours à portée de main</h2>
          <p>Gérez votre boutique depuis votre téléphone, où que vous soyez.</p>
          <Link to="/login" className="btn-secondary">Gérez</Link>
        </div>
        <div className="feature-image">
          <img src={mascotPhone} alt="Mascotte Makétu avec un téléphone" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
