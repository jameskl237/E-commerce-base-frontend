import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./AllProducts.scss";
import Footer from "../../components/Accueil/Footer";
import { API_BASE_URL } from "../../config/constants"; // Import the constant
import { Link } from 'react-router-dom'; // Import Link

// Import des icônes
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
} from "react-icons/fa";

const AllProducts = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  // Charger les produits au montage du composant
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        // ⚠️ Vérifie si ton API retourne { data: [...] } ou juste [...]
        setProducts(res.data.data || res.data);
        setLoading(false);
        console.log("Produits reçus:", res.data.data || res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des produits :", err);
        setError("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  // Charger les catégories au montage du composant
  useEffect(() => {
    api.get("/categories")
      .then(res => {
        setCategories(res.data.data || res.data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des catégories :", err);
      });
  }, []);

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || (product.category && product.category.id === parseInt(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="product-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Makétu</div>

        {/* Menu links desktop */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#">Catégories</a>
          </li>
          <li>
            <a href="#">Fournisseurs</a>
          </li>
          <li>
            <a href="#">Centre d’acheteurs</a>
          </li>
          <li>
            <a href="#">Assistance</a>
          </li>
        </ul>

        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>
            <FaSearch />
          </button>
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <button>
            <FaShoppingCart />
          </button>
          <button>
            <FaUser />
          </button>
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

      {/* Categories Dropdown */}
      <section className="categories-filter">
        <h2>Filtrer par Catégorie</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </section>

      {/* Produits */}
      <section className="products">
        <h2>Nos Produits</h2>

        {loading && <p>Chargement des produits...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="product-grid">
          {filteredProducts.length > 0
            ? filteredProducts.map((p) => (
                <Link to={`/product/${p.id}`} key={p.id} className="product-card-link">
                  <div className="product-card">
                    {/* ⚠️ Laravel doit retourner un champ "image_url" ou "image" */}
                    <img
                      src={
                        p.medias?.length > 0
                          ? `${API_BASE_URL}/storage/${p.medias[0].url.replace(/^\//, '')}`
                          : "/src/assets/default.jpg"
                      }
                      alt={p.name}
                    />
                    <h3>{p.name}</h3>
                    <p className="price">{p.price} FCFA</p>
                    <button className="buy-btn">Ajouter au panier</button>
                  </div>
                </Link>
              ))
            : !loading && <p>Aucun produit disponible.</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllProducts;
