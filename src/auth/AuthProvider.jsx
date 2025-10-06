// src/auth/AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

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
        setUser(res.data.data); // adapter selon ta réponse API
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    // adapter selon la réponse de ton backend (ex : res.data.access_token)
    const token = res.data.data.access_token || res.data.data.token;
    localStorage.setItem("access_token", token);
    // récupérer l'utilisateur
    const userRes = await api.get("/auth/user");
    setUser(userRes.data.data);
    return userRes.data.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    const token = res.data.data.access_token || res.data.data.token;
    if (token) localStorage.setItem("access_token", token);
    const userRes = await api.get("/auth/user");
    setUser(userRes.data.data);
    return userRes.data.data;
  };

  const logout = async () => {
    try {
      await api.post("/logout"); // si ton API fournit la route
    } catch (e) {
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

export function useAuth() {
  return useContext(AuthContext);
}
