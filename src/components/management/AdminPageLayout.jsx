// AdminPageLayout.jsx
import React from "react";
import AdminNoSidebarLayout from "./AdminNoSidebarLayout";
import BackButton from "./BackButton";

const AdminPageLayout = ({ 
  title, 
  subtitle, 
  children, 
  showBackButton = true, 
  backButtonTo = "/admin/dashboard",
  backButtonLabel = "Retour au tableau de bord"
}) => {
  return (
    <AdminNoSidebarLayout>
      <div className="admin-dashboard">
        {showBackButton && (
          <div className="admin-header">
            <BackButton to={backButtonTo} label={backButtonLabel} />
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
        )}
        {!showBackButton && (
          <div className="dashboard-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </AdminNoSidebarLayout>
  );
};

export default AdminPageLayout;
