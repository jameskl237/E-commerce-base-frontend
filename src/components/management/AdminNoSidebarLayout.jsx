// AdminNoSidebarLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import "./AdminLayout.scss";
import "../../styles/dashboard.scss";

import { useTheme } from "../../context/ThemeContext";

export default function AdminNoSidebarLayout({ children }) {
  const { darkMode } = useTheme();
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

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <div className="admin-layout">
        <Navbar ref={navbarRef} />

        <div className="main">
          <div className="content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
