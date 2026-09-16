import { createContext, useEffect, useState } from 'react';

import API from '../services/api';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await API.get('/cart');

      setCart(response.data.cart || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error.response?.data?.message || error.message);

      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================================
  // ADD TO CART - OPTIMISTIC
  // ==========================================
  const addToCart = async (product, quantity = 1) => {
    const previousCart = cart;

    // UI FIRST - instantly update
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);

      if (existingItem) {
        return currentCart.map(item =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity
        }
      ];
    });

    // API in background
    try {
      await API.post('/cart', {
        productId: product._id,
        quantity
      });

      // IMPORTANT:
      // No fetchCart() here.
      // UI is already updated instantly.
    } catch (error) {
      console.error('Failed to add to cart:', error.response?.data?.message || error.message);

      // Rollback if API fails
      setCart(previousCart);
    }
  };

  // ==========================================
  // INCREASE QUANTITY - OPTIMISTIC
  // ==========================================
  const increaseQuantity = async productId => {
    const currentProduct = cart.find(item => item._id === productId);

    if (!currentProduct) return;

    const previousCart = cart;
    const newQuantity = currentProduct.quantity + 1;

    // UI FIRST
    setCart(currentCart =>
      currentCart.map(item =>
        item._id === productId
          ? {
              ...item,
              quantity: newQuantity
            }
          : item
      )
    );

    // API in background
    try {
      await API.put(`/cart/${productId}`, {
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Failed to increase quantity:', error.response?.data?.message || error.message);

      // Rollback
      setCart(previousCart);
    }
  };

  // ==========================================
  // DECREASE QUANTITY - OPTIMISTIC
  // ==========================================
  const decreaseQuantity = async productId => {
    const currentProduct = cart.find(item => item._id === productId);

    if (!currentProduct) return;

    const previousCart = cart;
    const newQuantity = currentProduct.quantity - 1;

    // If quantity becomes 0, remove immediately
    if (newQuantity <= 0) {
      setCart(currentCart => currentCart.filter(item => item._id !== productId));

      try {
        await API.delete(`/cart/${productId}`);
      } catch (error) {
        console.error('Failed to remove item:', error.response?.data?.message || error.message);

        // Rollback
        setCart(previousCart);
      }

      return;
    }

    // UI FIRST
    setCart(currentCart =>
      currentCart.map(item =>
        item._id === productId
          ? {
              ...item,
              quantity: newQuantity
            }
          : item
      )
    );

    // API in background
    try {
      await API.put(`/cart/${productId}`, {
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Failed to decrease quantity:', error.response?.data?.message || error.message);

      // Rollback
      setCart(previousCart);
    }
  };

  // ==========================================
  // REMOVE FROM CART - OPTIMISTIC
  // ==========================================
  const removeFromCart = async productId => {
    const previousCart = cart;

    // UI FIRST
    setCart(currentCart => currentCart.filter(item => item._id !== productId));

    // API in background
    try {
      await API.delete(`/cart/${productId}`);
    } catch (error) {
      console.error('Failed to remove from cart:', error.response?.data?.message || error.message);

      // Rollback
      setCart(previousCart);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
