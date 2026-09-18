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

  const addToCart = async (product, quantity = 1) => {
    const previousCart = cart;

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

    try {
      await API.post('/cart', {
        productId: product._id,
        quantity
      });
    } catch (error) {
      console.error('Failed to add to cart:', error.response?.data?.message || error.message);

      setCart(previousCart);
    }
  };

  const increaseQuantity = async productId => {
    const currentProduct = cart.find(item => item._id === productId);

    if (!currentProduct) return;

    const previousCart = cart;
    const newQuantity = currentProduct.quantity + 1;

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

    try {
      await API.put(`/cart/${productId}`, {
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Failed to increase quantity:', error.response?.data?.message || error.message);

      setCart(previousCart);
    }
  };

  const decreaseQuantity = async productId => {
    const currentProduct = cart.find(item => item._id === productId);

    if (!currentProduct) return;

    const previousCart = cart;
    const newQuantity = currentProduct.quantity - 1;

    if (newQuantity <= 0) {
      setCart(currentCart => currentCart.filter(item => item._id !== productId));

      try {
        await API.delete(`/cart/${productId}`);
      } catch (error) {
        console.error('Failed to remove item:', error.response?.data?.message || error.message);

        setCart(previousCart);
      }

      return;
    }

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

    try {
      await API.put(`/cart/${productId}`, {
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Failed to decrease quantity:', error.response?.data?.message || error.message);

      setCart(previousCart);
    }
  };

  const removeFromCart = async productId => {
    const previousCart = cart;

    setCart(currentCart => currentCart.filter(item => item._id !== productId));

    try {
      await API.delete(`/cart/${productId}`);
    } catch (error) {
      console.error('Failed to remove from cart:', error.response?.data?.message || error.message);

      setCart(previousCart);
    }
  };

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
