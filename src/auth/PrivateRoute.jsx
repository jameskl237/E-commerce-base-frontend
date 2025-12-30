// src/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import {useAuth} from "./useAuth";

export default function PrivateRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="center">Chargement...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Optionnel : page 403
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
