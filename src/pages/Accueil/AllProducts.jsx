import React, { useState, useEffect } from "react";
import api from "../../services/api"; 
import "./AllProducts.scss";
import Footer from "../../components/Accueil/Footer";

// Import des icônes
import { 
  FaSearch, FaShoppingCart, FaUser, FaBars, 
  FaMobileAlt, FaTshirt, FaHome, FaSpa, FaCar 
} from "react-icons/fa";

const AllProducts = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Charger les produits au montage du composant
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        // ⚠️ Vérifie si ton API retourne { data: [...] } ou juste [...]
        setProducts(res.data.data || res.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des produits :", err);
        setError("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  return (
    <div className="product-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Makétu</div>

        {/* Menu links desktop */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="#">Catégories</a></li>
          <li><a href="#">Fournisseurs</a></li>
          <li><a href="#">Centre d’acheteurs</a></li>
          <li><a href="#">Assistance</a></li>
        </ul>

        {/* Search bar */}
        <div className="search-bar">
          <input type="text" placeholder="Rechercher un produit..." />
          <button><FaSearch /></button>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <button><FaShoppingCart /></button>
          <button><FaUser /></button>
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero-banner">
        <h1>Découvrez nos meilleures offres</h1>
        <p>Des produits de qualité à des prix compétitifs</p>
      </header>

      {/* Categories menu */}
      <section className="categories">
        <h2>Catégories populaires</h2>
        <div className="categories-grid">
          <div className="cat-card"><FaMobileAlt /> Électronique</div>
          <div className="cat-card"><FaTshirt /> Mode</div>
          <div className="cat-card"><FaHome /> Maison & Jardin</div>
          <div className="cat-card"><FaSpa /> Beauté</div>
          <div className="cat-card"><FaCar /> Automobile</div>
        </div>
      </section>

      {/* Produits */}
      <section className="products">
        <h2>Nos Produits</h2>

        {loading && <p>Chargement des produits...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="product-grid">
          {products.length > 0 ? (
            products.map((p) => (
              <div className="product-card" key={p.id}>
                {/* ⚠️ Laravel doit retourner un champ "image_url" ou "image" */}
                <img 
                  src={p.image_url || p.image || "/src/assets/default.jpg"} 
                  alt={p.name} 
                />
                <h3>{p.name}</h3>
                <p className="price">{p.price} FCFA</p>
                <button className="buy-btn">Ajouter au panier</button>
              </div>
            ))
          ) : (
            !loading && <p>Aucun produit disponible.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllProducts;
