// SupplierLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./SupplierLayout.scss";
import "../../styles/dashboard.scss";

export default function SupplierLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navbarRef = useRef();

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navbarRef.current) {
        setNavHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContentClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <div className="supplier-layout">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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
