// CartContext.js
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addPick = (pick) => {
    setCart((prev) => [...prev, pick]);
  };

  const removePick = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <div>
    <CartContext.Provider value={{ cart, addPick, removePick, clearCart }}>
      {children}
    </CartContext.Provider>
    </div>
  );
};

// Hook for easy access
export const useCart = () => useContext(CartContext);
