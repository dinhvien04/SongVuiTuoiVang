import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  serviceType: 'package' | 'activity';
  serviceName: string;
  packageType?: 'vip' | 'standard';
  price: number;
  pricePerDay: number;
  totalDays: number;
  priceUnit: string;
  elderName: string;
  elderAge: number;
  elderGender: string;
  elderRelationship: string;
  elderHealth: string;
  elderInsurance: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const updateItem = (id: string, updatedItem: CartItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...updatedItem, id } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        getTotalPrice,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
