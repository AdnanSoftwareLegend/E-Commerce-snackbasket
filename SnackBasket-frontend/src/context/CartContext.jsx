'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCartAPI, updateCartQuantityAPI, removeFromCartAPI } from '@/services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial Cart Load
  useEffect(() => {
    fetchUserCart();
  }, []);

  // Normalize server cart item -> frontend item
  const normalizeItem = (item) => {
    if (item.product && typeof item.product === 'object') {
      return {
        id: item.product._id,
        _id: item.product._id,
        title: item.product.title,
        price: item.product.finalPrice || item.product.price,
        oldPrice: item.product.oldPrice,
        discount: item.product.discount,
        image: item.product.image,
        vendor: item.product.vendor,
        stock: item.product.stock,
        quantity: item.quantity,
      };
    }
    return { ...item, id: item._id || item.id };
  };

  const fetchUserCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      const serverItems = data?.cart?.items || data?.items || [];
      setCartItems(serverItems.map(normalizeItem));
    } catch (error) {
      console.log('Cart fetch korte issue hoyeche, local fallback use hochhe');
    } finally {
      setLoading(false);
    }
  };

  const getProductId = (product) => product._id || product.id;

  // Add To Cart
  const addToCart = async (product, qty = 1) => {
    const productId = getProductId(product);

    try {
      // Optimistic UI Update
      setCartItems((prev) => {
        const exist = prev.find((item) => item.id === productId);
        if (exist) {
          return prev.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + qty } : item
          );
        }
        return [...prev, { ...product, id: productId, _id: productId, quantity: qty }];
      });

      // API Call
      await addToCartAPI(productId, qty);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Update Quantity
  const updateQuantity = async (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);

    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );

    try {
      await updateCartQuantityAPI(productId, qty);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    try {
      await removeFromCartAPI(productId);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);