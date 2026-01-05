// BackButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({ to = "/admin/dashboard", label = "Retour au tableau de bord" }) => {
  return (
    <Link to={to} className="back-button">
      <FiArrowLeft className="back-icon" />
      <span>{label}</span>
    </Link>
  );
};

export default BackButton;
