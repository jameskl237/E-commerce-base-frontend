import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./AllProducts.scss";
import Footer from "../../components/Accueil/Footer";
import { API_BASE_URL } from "../../config/constants";
import { Link } from 'react-router-dom';
import NavbarShop from '../../components/Shop/NavbarShop';
import Pagination from '../../components/Pagination';
import { useCart } from "../../context/CartContext";
import defaultImg from '../../assets/Maketu1.jpeg'; // fallback image import

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
    // { label: "Catégories", href: "#" },
    { label: "Boutiques", href: "/shops" },
    // { label: "Centre d’acheteurs", href: "#" },
    { label: "Assistance", href: "#" },
  ];

  // Fetch all products once on component mount
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const allData = res.data.data || res.data;
        setAllProducts(allData);
        console.log("Données de la boutique chargées :", allData);
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
        const cats = res.data.data || res.data;
        if (Array.isArray(cats)) {
          setCategories(cats);
        } else {
          console.error("La réponse de l'API /categories n'est pas un tableau:", cats);
        }
      })
      .catch(err => {
        console.error("Erreur lors du chargement des catégories :", err);
      });
  }, []);

  // Handle filtering and pagination on the client side
  useEffect(() => {
    // Ensure allProducts is an array before filtering
    let filteredData = Array.isArray(allProducts) ? [...allProducts] : [];

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

  // Fonction pour trouver l'URL de l'image principale.
  const getPrincipalImageUrl = (product) => {
    if (product) {
      // 0. fallback s'il existe un champ direct (thumbnail, image, picture, etc.)
      const direct =
        product.thumbnail ||
        product.image ||
        product.picture ||
        product.img ||
        product.photo;
      if (direct) {
        const url = String(direct);
        if (url.startsWith("http") || url.startsWith("//")) return url;
        return `${API_BASE_URL}/storage/${url.replace(/^\/+/, "")}`;
      }

      // 1. Si medias est un tableau, chercher media principal avec plusieurs variantes de clé
      if (Array.isArray(product.medias) && product.medias.length > 0) {
        const candidates = product.medias;

        // chercher propriétés qui peuvent indiquer le principal
        const principal =
          candidates.find(m => m.is_principal) ||
          candidates.find(m => m.isPrincipal) ||
          candidates.find(m => m.isMain) ||
          candidates.find(m => m.is_main) ||
          candidates.find(m => m.type === "primary") ||
          candidates.find(m => m.role === "primary");

        if (principal && (principal.url || principal.path || principal.full_url)) {
          const raw = principal.url || principal.full_url || principal.path || "";
          const url = String(raw);
          if (!url) return defaultImg;
          if (url.startsWith("http") || url.startsWith("//")) return url;
          return `${API_BASE_URL}/storage/${url.replace(/^\/+/, "")}`;
        }

        // 2. fallback: premier média ayant une URL
        const firstWithUrl = candidates.find(m => m.url || m.path || m.full_url);
        if (firstWithUrl) {
          const raw = firstWithUrl.url || firstWithUrl.full_url || firstWithUrl.path || "";
          const url = String(raw);
          if (!url) return defaultImg;
          if (url.startsWith("http") || url.startsWith("//")) return url;
          return `${API_BASE_URL}/storage/${url.replace(/^\/+/, "")}`;
        }
      }
    }

    // 3. Si aucune image trouvée, retourner l'image par défaut.
    return defaultImg;
  };

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
            ? products.map((p) => {
                const imageUrl = getPrincipalImageUrl(p);
                return (
                <Link to={`/product/${p.id}`} key={p.id} className="product-card-link">
                  <div className="product-card">
                    <img
                      src={imageUrl}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultImg; }}
                    />
                    <h3>{p.name}</h3>
                    <p className="price">{p.price} FCFA</p>
                    <button className="buy-btn" onClick={(e) => handleAddToCart(e, p)}>Ajouter au panier</button>
                  </div>
                </Link>
                )
              })
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
