// AdminLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./AdminLayout.scss";
import "../../styles/dashboard.scss";

import { useTheme } from "../../context/ThemeContext";

export default function AdminLayout({ children }) {
  const { darkMode } = useTheme();
  console.log('AdminLayout - darkMode:', darkMode); // Debug log
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navbarRef = useRef();

  useEffect(() => {
    console.log('AdminLayout useEffect running');
    if (navbarRef.current) {
      console.log('Navbar ref found, height:', navbarRef.current.offsetHeight);
      setNavHeight(navbarRef.current.offsetHeight);
    } else {
      console.log('Navbar ref not found');
    }

    const handleResize = () => {
      if (navbarRef.current) {
        console.log('Resize event, new height:', navbarRef.current.offsetHeight);
        setNavHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContentClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  console.log('AdminLayout rendering with darkMode:', darkMode, 'sidebarOpen:', sidebarOpen, 'navHeight:', navHeight);

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <div className="admin-layout">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          ref={navbarRef}
        />

        <div className="main">
          <Sidebar
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
            navHeight={navHeight}
          />
          <div className="content" onClick={handleContentClick}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
