import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getCsrfCookie } from '../../api/api';
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

// Moved PhoneInput component outside to prevent re-definition on every render
const PhoneInput = memo(({ section, id, value, onChange, phoneCodeValue, onPhoneCodeChange }) => (
    <div className="phone-input-group">
        <select
            id={`${id}-code`}
            value={phoneCodeValue}
            onChange={onPhoneCodeChange}
        >
            {countryCodes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <input
            type="tel"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder="Numéro de téléphone"
            required
        />
    </div>
));

const SupplierRegistrationForm = () => {
    const navigate = useNavigate();
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

    // Memoize handleChange to ensure its reference is stable
    const handleChange = useCallback((section, field) => (e) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [field]: value
            }
        }));
    }, []); // No dependencies, as setFormData is stable

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.user.password !== formData.user.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas.');
            return;
        }

        const apiPayload = {
            name: formData.user.name,
            username: formData.user.username,
            email: formData.user.email,
            phone: `${formData.user.phoneCode}${formData.user.phone}`,
            address: formData.user.address,
            password: formData.user.password,
            password_confirmation: formData.user.confirmPassword,
            shop_name: formData.shop.name,
            shop_description: formData.shop.description,
            shop_city: formData.shop.city,
            shop_district: formData.shop.district,
            shop_phone: `${formData.shop.phoneCode}${formData.shop.phone}`,
        };

        try {
            await getCsrfCookie();
            await api.post('/register-supplier', apiPayload);

            toast.success('Inscription réussie ! Vous allez être redirigé.');
            
            setTimeout(() => {
                navigate('/login');
            }, 3000); // 3-second delay to allow the user to read the message

        } catch (apiError) {
            console.error('Registration failed:', apiError);
            let errorMessage = 'Une erreur est survenue lors de l\'inscription.';

            if (apiError.response?.status === 422 && apiError.response?.data?.errors) {
                // Laravel validation errors
                const errors = apiError.response.data.errors;
                const messages = Object.values(errors).flat();
                errorMessage = messages.join('\n');
            } else if (apiError.response?.data?.message) {
                // Other errors with a 'message' field
                errorMessage = apiError.response.data.message;
            }

            toast.error(errorMessage, {
                autoClose: 5000, // Give more time to read multiple errors
                style: { whiteSpace: 'pre-line' } // Ensure newlines are rendered
            });
        }
    };

    return (
        <div className="supplier-registration-form">
            <form onSubmit={handleSubmit}>
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
                        <PhoneInput 
                            section="user" 
                            id="user-phone" 
                            value={formData.user.phone}
                            onChange={handleChange('user', 'phone')}
                            phoneCodeValue={formData.user.phoneCode}
                            onPhoneCodeChange={handleChange('user', 'phoneCode')}
                        />
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
                        <PhoneInput 
                            section="shop" 
                            id="shop-phone" 
                            value={formData.shop.phone}
                            onChange={handleChange('shop', 'phone')}
                            phoneCodeValue={formData.shop.phoneCode}
                            onPhoneCodeChange={handleChange('shop', 'phoneCode')}
                        />
                    </div>
                </fieldset>

                <button type="submit" className="submit-btn">Créer mon compte vendeur</button>
            </form>
        </div>
    );
};

export default SupplierRegistrationForm;
