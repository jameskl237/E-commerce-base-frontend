import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Shop/NavbarShop";
import Banner from "../../components/Shop/BannerShop";
import CategoryFilter from "../../components/Shop/CategoryFilter";
import ProductGrid from "../../components/Shop/ProductGrid";
import Footer from "../../components/Shop/Footer";
import "./Shop.scss";

const ShopPage = () => {
  const { shopId } = useParams();
  // const { shopId } = 1;
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    api
      .get(`/shops/${shopId}`)
      .then((res) => {
        const shopData = res.data.data.shop || res.data.data;
        const productsData = res.data.data.products || shopData.products || [];
        setShop(shopData);
        setProducts(productsData);

        // Extraire les catégories uniques
        const uniqueCategories = [
          ...new Map(
            productsData.map((p) => [p.category?.id, p.category])
          ).values(),
        ].filter(Boolean);
        setCategories(uniqueCategories);

        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger la boutique.");
        setLoading(false);
      });
  }, [shopId]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category?.id === parseInt(selectedCategory));

  return (
    <div className="shop-page">
      <Navbar shop={shop} />
      <Banner shop={shop} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <section className="products">
        <h2>Nos Produits</h2>
        <ProductGrid loading={loading} error={error} products={filteredProducts} />
      </section>
      <Footer shop={shop} />
    </div>
  );
};

export default ShopPage;
