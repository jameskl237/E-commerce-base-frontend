import React, { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check if the product is already in the cart
      const existingProductIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingProductIndex !== -1) {
        // If it exists, update the quantity
        const updatedCart = [...state];
        updatedCart[existingProduct-+-index].quantity += 1;
        return updatedCart;
      } else {
        // If it's a new product, add it to the cart
        return [...state, { ...action.payload, quantity: 1 }];
      }
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.payload.id);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  // Initialize state from localStorage
  const initialState = JSON.parse(localStorage.getItem('cart')) || [];
  const [cartItems, dispatch] = useReducer(cartReducer, initialState);

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};