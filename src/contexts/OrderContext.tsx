import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { api } from './api/api';
import type { OrderStatus } from '../lib/orders';

export interface OrderItem {
  productId: string;
  size: string;
  complements: (string | number)[];
  quantity: number;
}

/** Order item exactly as returned by the API (price already includes complements). */
export interface ProdutoPedido {
  id: number;
  preco: number;
  tamanho: string;
  produto: { id: number; nome: string; imagem?: string | null };
  complementos: { complemento: { id: number; nome: string; tipo: string; preco: number } }[];
}

export interface Order {
  id: number;
  nomeCliente: string;
  telefone?: string; // only returned to the admin
  endereco?: string; // only returned to the admin
  metodoPagamento: 'pix' | 'dinheiro' | 'cartao';
  trocoPara?: number | null;
  status: OrderStatus;
  criadoEm: string;
  produtos: ProdutoPedido[];
  total: number;
}

interface OrderData {
  products: OrderItem[];
  endereco: string;
  metodoPagamento: Order['metodoPagamento'];
  changeFor?: number;
  nomeCliente: string;
  telefone: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: OrderData) => Promise<number>;
  getOrderById: (id: string) => Promise<Order | null>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  /** Sends the order to the API (which calculates prices) and returns its id for tracking. */
  const createOrder = async (orderData: OrderData): Promise<number> => {
    const { data } = await api.post<Order>('/pedidos', {
      nomeCliente: orderData.nomeCliente,
      telefone: orderData.telefone,
      endereco: orderData.endereco,
      metodoPagamento: orderData.metodoPagamento,
      trocoPara: orderData.metodoPagamento === 'dinheiro' ? orderData.changeFor : undefined,
      produtos: orderData.products.map((item) => ({
        produtoId: Number(item.productId),
        tamanho: item.size,
        quantidade: item.quantity,
        complementos: item.complements.map(Number),
      })),
    });
    return data.id;
  };

  const getOrderById = useCallback(async (id: string) => {
    try {
      const { data } = await api.get<Order>(`/pedidos/${id}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      return null;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const { data } = await api.get<Order[]>('/pedidos');
    setOrders(data);
  }, []);

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    const previous = orders;
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
    try {
      await api.patch(`/pedidos/${id}/status`, { status });
    } catch (error) {
      setOrders(previous);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById, fetchOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
