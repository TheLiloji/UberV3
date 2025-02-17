import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isFloatingCartVisible: boolean;
  setFloatingCartVisible: (visible: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isFloatingCartVisible, setFloatingCartVisible] = useState(true);

  return (
    <UIContext.Provider value={{
      isFloatingCartVisible,
      setFloatingCartVisible,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
} 