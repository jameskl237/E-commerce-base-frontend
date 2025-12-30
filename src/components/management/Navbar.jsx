// src/components/Navbar.jsx
import React from "react";
import { FiLogOut, FiUser, FiMoon, FiSun, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";


import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

return (
    <nav className="navbar">
        <div className="navbar-left">
            {/* bouton menu sans background, visible seulement sur mobile */}
            <button
                className="icon-btn menu-btn"
                onClick={toggleSidebar}
            >
                <FiMenu color="#fff" />
            </button>
            <h1 className="logo">Dashboard</h1>
        </div>
        <div className="navbar-right">
            <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FiSun color="#fff" /> : <FiMoon color="#fff" />}
            </button>
            <button className="icon-btn">
                <FiUser color="#fff" />
            </button>
            <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut color="#fff" /> Déconnexion
            </button>
        </div>
    </nav>
);
}
