import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import NavbarShop from '../../components/Shop/NavbarShop';
import Footer from '../../components/Accueil/Footer';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/constants';
import Pagination from '../../components/Pagination';
import './SingleShopPage.scss';

const SingleShopPage = () => {
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
        const shopData = res.data.data || res.data;
        setShop(shopData);
        setAllProducts(shopData.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des données de la boutique:", err);
        setError('Impossible de charger les données de la boutique.');
        setLoading(false);
      });
  }, [shopId]);

  useEffect(() => {
    let filteredData = allProducts;

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
          {products.length > 0 ? (
            products.map(p => {
              console.log("Product data (p):", p); // Added console log
              return (
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
                  <button className="buy-btn">Ajouter au panier</button>
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