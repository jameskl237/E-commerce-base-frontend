// src/pages/supplier/ShopsDashboard.jsx
import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiEdit } from "react-icons/fi";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import SupplierLayout from "../../../components/management/SupplierLayout";

export default function ShopsDashboard() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get("auth/user"); 
      setShops(res.data.data.shops);
    } catch (err) {
      console.error("Erreur récupération boutiques", err);
    }
  };

  return (
    <SupplierLayout>
      <div className="shops-container">
        {shops.length === 0 ? (
          <p className="empty-text">Aucune boutique trouvée...</p>
        ) : (
          shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <FiShoppingBag className="shop-icon" />
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
              <button
                className="btn-edit"
                onClick={() => navigate(`/supplier/dashboard/${shop.id}`)}
              >
                <FiEdit /> Gestion
              </button>
            </div>
          ))
        )}
      </div>
    </SupplierLayout>
  );
}
