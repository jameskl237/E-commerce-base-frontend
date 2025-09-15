import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Accueil/Home";
import Shop from "./pages/Shop/Shop";
import AllProducts from "./pages/Accueil/AllProducts";
import Login from "./pages/management/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop/:id" element={<Shop />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/products" element={<AllProducts />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
