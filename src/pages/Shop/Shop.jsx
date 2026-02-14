import React, { useState, useEffect } from "react";
import api from "../../services/api";
import NavbarShop from "../../components/Shop/NavbarShop";
import Footer from "../../components/Accueil/Footer";
import { Link } from 'react-router-dom';
import "./Shop.scss";
import Pagination from '../../components/Pagination';
import { FaStore } from 'react-icons/fa'; // Import FaStore

const Shop = () => {
  const [allShops, setAllShops] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 10; // Changed to 10 for consistency with products

  const menuLinks = [
    { label: "Accueil", href: "/" },
    { label: "Nos produits", href: "/products" },
    { label: "Boutiques", href: "/shops" },
    // { label: "Assistance", href: "#" },
  ];

  // Fetch all shops once on component mount
  useEffect(() => {
    api.get("/shops")
      .then(res => {
        // Extraire les données de la réponse normalisée
        let allData = null;
        
        // Gérer différentes structures de réponse
        if (res.data && res.data.data !== undefined) {
          // Structure ApiResponse: {success, message, data, ...}
          allData = res.data.data;
        } else if (Array.isArray(res.data)) {
          // Réponse directe en tableau
          allData = res.data;
        } else if (res.data && typeof res.data === 'object') {
          // Autre structure, essayer de trouver un tableau
          allData = res.data.shops || res.data.items || [];
        } else {
          allData = [];
        }
        
        // S'assurer que allData est toujours un tableau
        if (!Array.isArray(allData)) {
          console.error("La réponse de l'API /shops n'est pas un tableau:", allData, res.data);
          allData = [];
        }
        
        setAllShops(allData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des boutiques :", err);
        setError("Impossible de charger les boutiques.");
        setLoading(false);
        setAllShops([]);
      });
  }, []);

  // Handle filtering and pagination on the client side
  useEffect(() => {
    // S'assurer que allShops est un tableau
    let filteredData = Array.isArray(allShops) ? [...allShops] : [];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shop.description && shop.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Calculate total pages based on filtered data
    setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));

    // Slice the data for the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setShops(filteredData.slice(startIndex, endIndex));

  }, [currentPage, allShops, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="shops-all-page">
      <NavbarShop
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          setCurrentPage(1); // Reset to first page on search
        }}
        menuLinks={menuLinks}
      />

      <header className="hero-banner">
        <h1>Découvrez nos Boutiques</h1>
        <p>Explorez une variété de magasins et leurs produits</p>
      </header>

      <section className="shops-list-section">
        <h2>Toutes nos Boutiques</h2>
        {loading && <p>Chargement des boutiques...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <div className="shops-grid">
          {Array.isArray(shops) && shops.length > 0 ? (
            shops.map(shop => (
              <Link to={`/shop/${shop.id}/${encodeURIComponent(shop.name)}`} key={shop.id} className="shop-card-link">
                <div className="shop-card">
                  <FaStore className="shop-icon" />
                  <h3>{shop.name}</h3>
                  <p>{shop.description}</p>
                </div>
              </Link>
            ))
          ) : (
            !loading && <p>Aucune boutique disponible pour cette recherche.</p>
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

export default Shop;
