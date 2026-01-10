import api from '../api/api';

// API service for user and shop registration
export const registerSupplier = async (userData, shopData) => {
  try {
    // First register the user
    const userResponse = await api.post('/auth/register', {
      ...userData,
      role: 'supplier' // Ensure the role is set to supplier
    });

    // Extract user data and token from response
    const token = userResponse.data?.data?.access_token || 
                  userResponse.data?.data?.token || 
                  userResponse.data?.access_token || 
                  userResponse.data?.token;
    
    const user = userResponse.data?.data?.user || userResponse.data?.user || userResponse.data;

    // If user registration was successful, create the shop
    if (token && user?.id) {
      // Add user_id to shop data
      const shopPayload = {
        ...shopData,
        user_id: user.id
      };

      const shopResponse = await api.post('/shops', shopPayload);

      return {
        user: user,
        shop: shopResponse.data?.data || shopResponse.data,
        token: token
      };
    } else {
      throw new Error('User registration failed or incomplete response');
    }
  } catch (error) {
    // Clean up token if registration fails
    if (localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token');
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Registration failed';
    
    throw new Error(errorMessage);
  }
};

// Alternative approach: Register user and shop in a single API call if backend supports it
export const registerSupplierWithShop = async (registrationData) => {
  try {
    const response = await api.post('/auth/register-with-shop', registrationData);
    return response.data;
  } catch (error) {
    // Clean up token if registration fails
    if (localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token');
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Registration failed';
    
    throw new Error(errorMessage);
  }
};