import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import NavbarShop from '../../components/Shop/NavbarShop';
import Footer from '../../components/Accueil/Footer';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/constants';
import Pagination from '../../components/Pagination';
import { useCart } from '../../context/CartContext';
import './SingleShopPage.scss';
import defaultImg from '../../assets/Maketu1.jpeg'; // fallback image import

const SingleShopPage = () => {
  const { addToCart } = useCart();
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 15;

  const menuLinks = [
    { label: "Accueil", href: "/products" },
    { label: "Boutiques", href: "/shops" },
  ];

  useEffect(() => {
    setLoading(true);
    api.get(`/shops/${shopId}`)
      .then(res => {
        // Extraire les données de la réponse normalisée
        let shopData = null;
        
        // Gérer différentes structures de réponse
        if (res.data && res.data.data !== undefined) {
          // Structure ApiResponse: {success, message, data, ...}
          shopData = res.data.data;
        } else if (res.data && typeof res.data === 'object') {
          // Réponse directe en objet
          shopData = res.data;
        } else {
          shopData = null;
        }
        
        if (!shopData) {
          setError('Boutique non trouvée.');
          setLoading(false);
          setAllProducts([]);
          return;
        }
        
        setShop(shopData);
        
        // S'assurer que products est toujours un tableau
        let products = shopData.products || [];
        if (!Array.isArray(products)) {
          console.error("Les produits de la boutique ne sont pas un tableau:", products);
          products = [];
        }
        
        setAllProducts(products);
        console.log("Données de la boutique chargées :", shopData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des données de la boutique:", err);
        setError('Impossible de charger les données de la boutique.');
        setLoading(false);
        setAllProducts([]);
      });
  }, [shopId]);

  useEffect(() => {
    // S'assurer que allProducts est un tableau
    let filteredData = Array.isArray(allProducts) ? [...allProducts] : [];

    if (searchQuery) {
      filteredData = filteredData.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setProducts(filteredData.slice(startIndex, endIndex));

  }, [currentPage, allProducts, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="single-shop-page">
      <NavbarShop 
        searchQuery={searchQuery} 
        setSearchQuery={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }} 
        menuLinks={menuLinks} 
      />

      {shop && (
        <header className="shop-hero">
          <h1>{shop.name}</h1>
          <p>{shop.description}</p>
        </header>
      )}

      <section className="shop-products">
        <h2>Produits de la boutique</h2>
        <div className="product-grid">
          {Array.isArray(products) && products.length > 0 ? (
            products.map(p => {
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
                  <button className="buy-btn" onClick={(e) => {e.preventDefault(); addToCart(p);}}>Ajouter au panier</button>
                </div>
              </Link>
              )
            })
          ) : (
            <p>Aucun produit trouvé pour cette boutique.</p>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </section>

      <Footer />
    </div>
  );
};

export default SingleShopPage;