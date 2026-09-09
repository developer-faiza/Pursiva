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
    try {
      await API.post('/cart', {
        productId: product._id,
        quantity
      });

      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error.response?.data?.message || error.message);
    }
  };

  const increaseQuantity = async productId => {
    try {
      const currentProduct = cart.find(item => item._id === productId);

      if (!currentProduct) return;

      await API.put(`/cart/${productId}`, {
        quantity: currentProduct.quantity + 1
      });

      setCart(previousCart =>
        previousCart.map(item =>
          item._id === productId
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to increase quantity:', error.response?.data?.message || error.message);
    }
  };

  const decreaseQuantity = async productId => {
    try {
      const currentProduct = cart.find(item => item._id === productId);

      if (!currentProduct) return;

      if (currentProduct.quantity === 1) {
        await API.delete(`/cart/${productId}`);

        setCart(previousCart => previousCart.filter(item => item._id !== productId));

        return;
      }

      await API.put(`/cart/${productId}`, {
        quantity: currentProduct.quantity - 1
      });

      setCart(previousCart =>
        previousCart.map(item =>
          item._id === productId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to decrease quantity:', error.response?.data?.message || error.message);
    }
  };

  const removeFromCart = async productId => {
    try {
      await API.delete(`/cart/${productId}`);

      setCart(previousCart => previousCart.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Failed to remove from cart:', error.response?.data?.message || error.message);
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
