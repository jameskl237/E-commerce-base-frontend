import React from 'react';
import SupplierRegistrationForm from '../../../components/Supplier/SupplierRegistrationForm';
import BackButton from '../../../components/management/BackButton';
import './SupplierRegistrationPage.scss';

const SupplierRegistrationPage = () => {
  return (
    <div className="supplier-registration-page">
      <div className="page-header">
        <BackButton to="/" label="Retour" />
        <h1>Devenir un vendeur partenaire</h1>
      </div>
      <SupplierRegistrationForm />
    </div>
  );
};

export default SupplierRegistrationPage;