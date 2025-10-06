import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Accueil/Home";
import Shop from "./pages/Shop/Shop";
import AllProducts from "./pages/Accueil/AllProducts";
import Login from "./pages/management/Login";
import SupplierDashboard from "./pages/management/supplier/SupplierManagement";
import ShopsDashboard from "./pages/management/supplier/ShopsDashboard";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";
import ApiTest from "./components/ApiTest";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/shop/:id" element={<Shop />} />
          <Route path="/products" element={<AllProducts />} />
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

          {/* Add more routes as needed */}
        </Routes>
    </Router>
    </AuthProvider>
  );
}
