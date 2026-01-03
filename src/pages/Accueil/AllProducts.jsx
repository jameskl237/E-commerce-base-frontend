import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./AllProducts.scss";
import Footer from "../../components/Accueil/Footer";
import { API_BASE_URL } from "../../config/constants";
import { Link } from 'react-router-dom';
import NavbarShop from '../../components/Shop/NavbarShop';
import Pagination from '../../components/Pagination';
import { useCart } from "../../context/CartContext";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  const ITEMS_PER_PAGE = 12;

  const menuLinks = [
    { label: "Catégories", href: "#" },
    { label: "Boutiques", href: "/shops" },
    { label: "Centre d’acheteurs", href: "#" },
    { label: "Assistance", href: "#" },
  ];

  // Fetch all products once on component mount
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const allData = res.data.data || res.data;
        setAllProducts(allData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des produits :", err);
        setError("Impossible de charger les produits");
        setLoading(false);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    api.get("/categories")
      .then(res => {
        setCategories(res.data.data || res.data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des catégories :", err);
      });
  }, []);

  // Handle filtering and pagination on the client side
  useEffect(() => {
    let filteredData = allProducts;

    // Apply category filter
    if (selectedCategory) {
      filteredData = filteredData.filter(product => product.category && product.category.id === parseInt(selectedCategory));
    }

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Calculate total pages based on filtered data
    setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));

    // Slice the data for the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setProducts(filteredData.slice(startIndex, endIndex));

  }, [currentPage, allProducts, selectedCategory, searchQuery]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <div className="product-page">
      <NavbarShop searchQuery={searchQuery} setSearchQuery={setSearchQuery} menuLinks={menuLinks} />

      <header className="hero-banner">
        <h1>Découvrez nos meilleures offres</h1>
        <p>Des produits de qualité à des prix compétitifs</p>
      </header>

      <section className="categories-filter">
        <h2>Filtrer par Catégorie</h2>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // Reset to first page on filter change
          }}
          className="category-dropdown"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </section>

      <section className="products">
        <h2>Nos Produits</h2>

        {loading && <p>Chargement des produits...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="product-grid">
          {products.length > 0
            ? products.map((p) => (
                <Link to={`/product/${p.id}`} key={p.id} className="product-card-link">
                  <div className="product-card">
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
                    <button className="buy-btn" onClick={(e) => handleAddToCart(e, p)}>Ajouter au panier</button>
                  </div>
                </Link>
              ))
            : !loading && <p>Aucun produit disponible pour les filtres sélectionnés.</p>}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </section>

      <Footer />
    </div>
  );
};

export default AllProducts;
