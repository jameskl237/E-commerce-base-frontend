import React, { useState } from 'react';
import './SupplierRegistrationForm.scss';

// A small list of country codes for the phone number input
const countryCodes = [
    { code: '237', name: 'Cameroun (+237)' },
    { code: '235', name: 'Tchad (+235)' },
    { code: '241', name: 'Gabon (+241)' },
    { code: '229', name: 'Bénin (+229)' },
    { code: '225', name: 'Côte d\'Ivoire (+225)' },
    { code: '221', name: 'Sénégal (+221)' },
];

const SupplierRegistrationForm = () => {
    const [formData, setFormData] = useState({
        user: {
            name: '',
            username: '',
            email: '',
            phone: '',
            phoneCode: '237',
            address: '',
            password: '',
            confirmPassword: '',
        },
        shop: {
            name: '',
            description: '',
            city: '',
            district: '',
            phone: '',
            phoneCode: '237',
        }
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (section, field) => (e) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.user.password !== formData.user.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        const apiPayload = {
            name: formData.user.name,
            username: formData.user.username,
            email: formData.user.email,
            phone: `${formData.user.phoneCode}${formData.user.phone}`,
            address: formData.user.address,
            password: formData.user.password,
            shop_name: formData.shop.name,
            shop_description: formData.shop.description,
            shop_city: formData.shop.city,
            shop_district: formData.shop.district,
            shop_phone: `${formData.shop.phoneCode}${formData.shop.phone}`,
        };

        console.log('Submitting data to API:', apiPayload);

        try {
            // Replace with your actual API call
            // const response = await api.post('/register-supplier', apiPayload);
            setSuccess('Siimulation d\'inscription réussie !');
        } catch (apiError) {
            setError(apiError.message || 'Une erreur est survenue lors de l\'inscription.');
        }
    };

    const PhoneInput = ({ section, id }) => (
        <div className="phone-input-group">
            <select
                id={`${id}-code`}
                value={formData[section].phoneCode}
                onChange={handleChange(section, 'phoneCode')}
            >
                {countryCodes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <input
                type="tel"
                id={id}
                name={id}
                value={formData[section].phone}
                onChange={handleChange(section, 'phone')}
                placeholder="Numéro de téléphone"
                required
            />
        </div>
    );

    return (
        <div className="supplier-registration-form">
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <fieldset>
                    <legend>Informations sur le Vendeur</legend>
                    <div className="form-group">
                        <label htmlFor="user-name">Nom complet</label>
                        <input type="text" id="user-name" value={formData.user.name} onChange={handleChange('user', 'name')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-username">Nom d'utilisateur</label>
                        <input type="text" id="user-username" value={formData.user.username} onChange={handleChange('user', 'username')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-email">Email</label>
                        <input type="email" id="user-email" value={formData.user.email} onChange={handleChange('user', 'email')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-phone">Téléphone du vendeur</label>
                        <PhoneInput section="user" id="user-phone" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-address">Adresse</label>
                        <input type="text" id="user-address" value={formData.user.address} onChange={handleChange('user', 'address')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-password">Mot de passe</label>
                        <input type="password" id="user-password" value={formData.user.password} onChange={handleChange('user', 'password')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-confirmPassword">Confirmer le mot de passe</label>
                        <input type="password" id="user-confirmPassword" value={formData.user.confirmPassword} onChange={handleChange('user', 'confirmPassword')} required />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Informations sur la Boutique</legend>
                    <div className="form-group">
                        <label htmlFor="shop-name">Nom de la boutique</label>
                        <input type="text" id="shop-name" value={formData.shop.name} onChange={handleChange('shop', 'name')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shop-description">Description</label>
                        <textarea id="shop-description" value={formData.shop.description} onChange={handleChange('shop', 'description')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shop-city">Ville</label>
                        <input type="text" id="shop-city" value={formData.shop.city} onChange={handleChange('shop', 'city')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shop-district">Quartier</label>
                        <input type="text" id="shop-district" value={formData.shop.district} onChange={handleChange('shop', 'district')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shop-phone">Téléphone de la boutique</label>
                        <PhoneInput section="shop" id="shop-phone" />
                    </div>
                </fieldset>

                <button type="submit" className="submit-btn">Créer mon compte vendeur</button>
            </form>
        </div>
    );
};

export default SupplierRegistrationForm;
