// src/components/management/ModalConfirmation.jsx
import React from "react";
import "./ModalConfirmation.scss";

const ModalConfirmation = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isDarkMode = false // 👈 pour gérer le thème
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-backdrop ${isDarkMode ? "dark" : ""}`}></div>
      <div className={`modal ${isDarkMode ? "dark" : ""}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn btn-confirm" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalConfirmation;
