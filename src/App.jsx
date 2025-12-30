import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Accueil/Home";
import Shop from "./pages/Shop/Shop";
import AllProducts from "./pages/Accueil/AllProducts";
import Login from "./pages/management/Login";
import SupplierDashboard from "./pages/management/supplier/SupplierManagement";
import ShopsDashboard from "./pages/management/supplier/ShopsDashboard";
import ProductEditPage from "./pages/management/supplier/product-edit/ProductEditPage"; // Import de la nouvelle page
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiTest from "./components/ApiTest";
import ProductShowPage from "./pages/Product/ProductShowPage"; // Import ProductShowPage
import SingleShopPage from "./pages/Shop/SingleShopPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<Shop />} />
          <Route path="/shop/:shopId/:shopName" element={<SingleShopPage />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:productId" element={<ProductShowPage />} /> {/* New route for product show page */}
          <Route path="/test-api" element={<ApiTest />} />
          <Route path="/supplier/dashboard/:shopId" element={
            <PrivateRoute>
              <SupplierDashboard />
            </PrivateRoute>
          } />

          <Route path="supplier/Shops/dashboard" element={
            <PrivateRoute>
              <ShopsDashboard />
            </PrivateRoute>
          } />

          <Route path="/supplier/product/edit/:productId" element={
            <PrivateRoute>
              <ProductEditPage />
            </PrivateRoute>
          } />

          {/* Add more routes as needed */}
        </Routes>
        <ToastContainer />
    </Router>
    </AuthProvider>
  );
}
