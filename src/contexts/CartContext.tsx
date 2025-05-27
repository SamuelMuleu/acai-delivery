import { createContext, useContext, useState, useEffect } from 'react';
import { AuthProviderProps } from './AuthContext';

interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  complements: string[];
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: AuthProviderProps) => {


  const [cart, setCart] = useState<CartItem[]>([]);


  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const findCartItemIndex = (item: CartItem) => {
    return cart.findIndex(
      cartItem =>
        cartItem.productId === item.productId &&
        cartItem.size === item.size &&
        JSON.stringify(cartItem.complements.sort()) === JSON.stringify(item.complements.sort())
    );
  };

  const addToCart = (item: CartItem) => {
    const existingItemIndex = findCartItemIndex(item);

    if (existingItemIndex !== -1) {

      const newCart = [...cart];
      newCart[existingItemIndex].quantity += item.quantity;
      setCart(newCart);
    } else {

      setCart(prev => [...prev, item]);
    }
  };

  const removeFromCart = (item: CartItem) => {
    const existingItemIndex = findCartItemIndex(item);

    if (existingItemIndex !== -1) {
      const newCart = [...cart];
      newCart.splice(existingItemIndex, 1);
      setCart(newCart);
    }
  };

  const updateQuantity = (item: CartItem, quantity: number) => {
    const existingItemIndex = findCartItemIndex(item);

    if (existingItemIndex !== -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity = quantity;
      setCart(newCart);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
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
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};