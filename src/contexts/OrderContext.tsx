import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProducts } from './ProductsContext';

interface OrderItem {
  productId: string;
  size: string;
  complements: string[];
  quantity: number;
}

interface Order {
  id: string;
  trackingCode: string;
  items: any[];
  address: string;
  paymentMethod: string;
  changeFor: number | null;
  status: 'Pendente' | 'Em Preparo' | 'Pronto' | 'Saiu para entrega' | 'Entregue';
  total: number;
}

interface OrderContextType {
  createOrder: (orderData: any) => string;
  getOrderByCode: (code: string) => Order | null;
  getOrderById: (id: string) => Order | null;
  getAllOrders: () => Order[];
  updateOrderStatus: (id: string, status: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getProductById } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);

  const generateTrackingCode = () => {
    // Generate a code like PED1234
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PED${randomNum}`;
  };

  const createOrder = (orderData: any) => {
    const { products: orderItems, address, paymentMethod, changeFor } = orderData;
    
    // Prepare full item details with prices
    const items = orderItems.map((item: OrderItem) => {
      const product = getProductById(item.productId);
      const size = product.tamanhos.find((t: any) => t.rotulo === item.size);
      
      return {
        productId: item.productId,
        name: product.nome,
        image: product.imagem,
        size: item.size,
        price: size.preco,
        complements: item.complements,
        quantity: item.quantity
      };
    });
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate tracking code
    const trackingCode = generateTrackingCode();
    
    const newOrder: Order = {
      id: uuidv4(),
      trackingCode,
      items,
      address,
      paymentMethod,
      changeFor,
      status: 'Pendente',
      total
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    return trackingCode;
  };

  const getOrderByCode = (code: string) => {
    return orders.find(order => order.trackingCode === code) || null;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id) || null;
  };

  const getAllOrders = () => {
    return orders;
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { 
          ...order, 
          status: status as 'Pendente' | 'Em Preparo' | 'Pronto' | 'Saiu para entrega' | 'Entregue' 
        } : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{
      createOrder,
      getOrderByCode,
      getOrderById,
      getAllOrders,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};