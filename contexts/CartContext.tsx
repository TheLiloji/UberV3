import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItemOption {
  name: string;
  choice: {
    id: string;
    name: string;
    price: number;
  };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: CartItemOption[];
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, restaurantId?: string, optionsKey?: string) => void;
  updateQuantity: (itemId: string, quantity: number, restaurantId?: string, optionsKey?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    const newItem = {
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity || 1),
      restaurantId: String(item.restaurantId || '')
    };

    const existingItemIndex = items.findIndex(
      (cartItem) => 
        cartItem.id === newItem.id && 
        cartItem.restaurantId === newItem.restaurantId &&
        JSON.stringify(cartItem.selectedOptions) === JSON.stringify(newItem.selectedOptions)
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }
  };

  const removeFromCart = (itemId: string, restaurantId?: string, optionsKey?: string) => {
    if (optionsKey) {
      setItems(items.filter((item) => {
        if (item.id !== itemId) return true;
        if (item.restaurantId !== restaurantId) return true;
        return JSON.stringify(item.selectedOptions) !== optionsKey;
      }));
    } else if (restaurantId) {
      setItems(items.filter((item) => !(item.id === itemId && item.restaurantId === restaurantId)));
    } else {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const updateQuantity = (itemId: string, quantity: number, restaurantId?: string, optionsKey?: string) => {
    const updatedItems = items.map((item) => {
      if (item.id !== itemId) return item;
      
      if (restaurantId && item.restaurantId !== restaurantId) return item;
      
      if (optionsKey) {
        const itemOptionsKey = JSON.stringify(item.selectedOptions);
        if (itemOptionsKey !== optionsKey) return item;
      } else if (item.selectedOptions && item.selectedOptions.length > 0) {
        return item;
      }
      
      return { ...item, quantity: Number(quantity) };
    });
    
    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      return total + (Number(item.price) * Number(item.quantity));
    }, 0);
  };

  const getCount = () => {
    return items.reduce((count, item) => count + Number(item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
        clearCart,
      getTotal,
      getCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 