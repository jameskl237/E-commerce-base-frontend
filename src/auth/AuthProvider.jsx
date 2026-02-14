import React, { useState, useEffect } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext"; // Chemin corrigé

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // objet utilisateur {id, name, role, ...}
  const [loading, setLoading] = useState(true);

  // Hydrate user si token déjà présent (ex: reload page)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/user")
      .then(res => {
        // Gérer différentes structures de réponse
        const user = res.data?.data || res.data?.user || res.data;
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Écouter les événements de déconnexion (401 depuis l'interceptor)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };
    
    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      // Gérer différentes structures de réponse possibles
      const token = 
        res.data?.data?.access_token || 
        res.data?.data?.token ||
        res.data?.access_token || 
        res.data?.token ||
        res.access_token ||
        res.token;
      
      if (!token) {
        throw new Error("Token non reçu du serveur");
      }
      
      localStorage.setItem("access_token", token);
      
      // récupérer l'utilisateur
      try {
        const userRes = await api.get("/auth/user");
        const user = userRes.data?.data || userRes.data?.user || userRes.data;
        setUser(user);
        return user;
      } catch (userError) {
        // Si la récupération de l'utilisateur échoue, nettoyer le token
        localStorage.removeItem("access_token");
        throw new Error("Impossible de récupérer les informations utilisateur");
      }
    } catch (error) {
      // Nettoyer le token en cas d'erreur
      localStorage.removeItem("access_token");
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      // Gérer différentes structures de réponse possibles
      const token = 
        res.data?.data?.access_token || 
        res.data?.data?.token ||
        res.data?.access_token || 
        res.data?.token ||
        res.access_token ||
        res.token;
      
      if (!token) {
        throw new Error("Token non reçu du serveur");
      }
      
      localStorage.setItem("access_token", token);
      
      try {
        const userRes = await api.get("/auth/user");
        const user = userRes.data?.data || userRes.data?.user || userRes.data;
        setUser(user);
        return user;
      } catch (userError) {
        localStorage.removeItem("access_token");
        throw new Error("Impossible de récupérer les informations utilisateur");
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout"); // si ton API fournit la route
    } catch {
      // ignore
    }
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
