// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import {useAuth} from "../../auth/useAuth"; // ⚠️ décommente pour activer l'auth
import { useNavigate, Link } from "react-router-dom";

import "../../styles/auth.scss";

export default function Login() {
  const { login } = useAuth(); // ⚠️ active si tu veux consommer l'API
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success("Connexion réussie !");
      if (user.role === "administrator") navigate("/admin/dashboard");
      else navigate("/supplier/shops/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Échec de l'authentification";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <label>Email
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="Entrez votre email"
            required
          />
        </label>

        <label>Mot de passe
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Entrez votre mot de passe"
            required
          />
        </label>

        <button className="btn-primary" disabled={submitting}>
          {submitting ? "Connexion..." : "Se connecter"}
        </button>

        <div className="forgot-password">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </div>

        {/* ✅ Bouton Google */}
        <button type="button" className="btn-google">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="google-icon"
          />
          Se connecter avec Google
        </button>
      </form>
    </div>
  );
}
