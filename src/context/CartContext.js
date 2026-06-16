import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, size, color } = action.payload;
      const key = `${product._id}-${size || ''}-${color || ''}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, {
          key,
          product,
          quantity,
          size,
          color,
          price: product.discountPrice && product.discountPrice < product.price
            ? product.discountPrice
            : product.price
        }]
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.key !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.key === action.payload.key ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

const initialState = { items: [] };

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dbc_cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dbc_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1, size, color) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color } });
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
  };

  const removeFromCart = (key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: key });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (key, quantity) => {
    dispatch({ type: 'UPDATE_QTY', payload: { key, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  // Computed values
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : (subtotal > 0 ? 2500 : 0);
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider value={{
      items: state.items,
      itemCount,
      subtotal,
      shippingFee,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
