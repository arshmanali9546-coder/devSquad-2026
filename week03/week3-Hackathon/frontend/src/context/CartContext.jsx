import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { token, user } = useAuth();
  
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  api.interceptors.request.use(config => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  const fetchCart = async () => {
    if (!token || !user) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, user]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    if (!token) {
      alert("Please login to add items to cart!");
      return;
    }
    try {
      await api.post('/cart/add', { productId, variantId, quantity });
      await fetchCart();
      setCartDrawerOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data || error.message);
      alert(error.response?.data?.error || "Error adding to cart");
    }
  };

  const updateQuantity = async (productId, variantId, quantity) => {
    try {
      await api.put('/cart/update', { productId, variantId, quantity });
      fetchCart();
    } catch (error) {
       alert(error.response?.data?.error || "Error updating cart");
    }
  };

  const removeFromCart = async (productId, variantId) => {
    try {
      await api.delete(`/cart/remove/${productId}/${variantId}`);
      fetchCart();
    } catch (error) {
       alert(error.response?.data?.error || "Error removing item");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartDrawerOpen, setCartDrawerOpen, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
