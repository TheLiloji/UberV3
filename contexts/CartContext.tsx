import React, { createContext, useContext, useState } from 'react';

interface CartItemOption {
  name: string;
  choice: {
    id: number;
    name: string;
    price: number;
  };
}

interface CartItem {
  id: string;
  restaurantId: number;
  restaurantName?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedOptions?: CartItemOption[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string, restaurantId?: number) => void;
  updateQuantity: (itemId: string, quantity: number, restaurantId?: number) => void;
  getItemQuantity: (itemId: string, restaurantId?: number) => number;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Fonction utilitaire pour créer un ID unique
  const createUniqueId = (itemId: string, restaurantId?: number) => {
    return `${restaurantId}-${itemId}`;
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Créer un ID unique qui inclut les options sélectionnées
      const optionsString = item.selectedOptions 
        ? `-${item.selectedOptions.map(o => `${o.name}-${o.choice.id}`).join('-')}` 
        : '';
      const uniqueId = `${item.restaurantId}-${item.id}${optionsString}`;
      
      const existingItem = currentItems.find(i => {
        const currentOptionsString = i.selectedOptions
          ? `-${i.selectedOptions.map(o => `${o.name}-${o.choice.id}`).join('-')}`
          : '';
        return `${i.restaurantId}-${i.id}${currentOptionsString}` === uniqueId;
      });

      if (existingItem) {
        return currentItems.map(i => {
          const currentOptionsString = i.selectedOptions
            ? `-${i.selectedOptions.map(o => `${o.name}-${o.choice.id}`).join('-')}`
            : '';
          return `${i.restaurantId}-${i.id}${currentOptionsString}` === uniqueId
            ? { ...i, quantity: i.quantity + 1 }
            : i;
        });
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string, restaurantId?: number) => {
    const uniqueId = createUniqueId(itemId, restaurantId);
    setItems(currentItems => 
      currentItems.filter(i => createUniqueId(i.id, i.restaurantId) !== uniqueId)
    );
  };

  const updateQuantity = (itemId: string, quantity: number, restaurantId?: number) => {
    const uniqueId = createUniqueId(itemId, restaurantId);
    setItems(currentItems =>
      currentItems.map(i =>
        createUniqueId(i.id, i.restaurantId) === uniqueId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const getItemQuantity = (itemId: string, restaurantId?: number) => {
    const uniqueId = createUniqueId(itemId, restaurantId);
    return items.find(i => createUniqueId(i.id, i.restaurantId) === uniqueId)?.quantity || 0;
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getItemQuantity,
      getTotal,
      getCount,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 