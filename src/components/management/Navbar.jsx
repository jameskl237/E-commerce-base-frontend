// src/components/Navbar.jsx
import React from "react";
import { FiLogOut, FiUser, FiMoon, FiSun, FiMenu } from "react-icons/fi";
import api from "../../api/api";


export default function Navbar({ darkMode, setDarkMode, toggleSidebar }) {
  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      window.location.replace("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    }
  };

return (
    <nav className="navbar" style={{ borderColor: "#fff", borderStyle: "solid", borderWidth: "1px" }}>
        <div className="navbar-left">
            {/* bouton menu sans background, visible seulement sur mobile */}
            <button
                className="icon-btn menu-btn"
                onClick={toggleSidebar}
                style={{ background: "none", boxShadow: "none", border: "1px solid #fff" }}
            >
                <FiMenu color="#fff" />
            </button>
            <h1 className="logo">Dashboard</h1>
        </div>
        <div className="navbar-right">
            <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} style={{ border: "none" }}>
                {darkMode ? <FiSun color="#fff" /> : <FiMoon color="#fff" />}
            </button>
            <button className="icon-btn" style={{ border: "none" }}>
                <FiUser color="#fff" />
            </button>
            <button className="logout-btn" onClick={handleLogout} style={{ border: "1px solid #fff" }}>
                <FiLogOut color="#fff" /> Déconnexion
            </button>
        </div>
    </nav>
);
}
