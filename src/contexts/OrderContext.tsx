import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProducts } from './ProductsContext';

import { api } from './api/api';


export interface OrderItem {
  productId: string;
  size: string;
  complements: string[];
  quantity: number;
}


interface ProductFromContext {
  id: string;
  nome: string;
  imagem: string;
  tamanhos: Tamanho[];

}

export interface PreparedItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  complements: string[];
  quantity: number;
}


export interface Order {
  id: string;
  trackingCode: string;
  items: PreparedItem[];
  address: string;
  paymentMethod: string;
  changeFor: number | null;
  status: 'Pendente' | 'Em Preparo' | 'Pronto' | 'Saiu para entrega' | 'Entregue';
  total: number;
}

interface OrderData {
  products: OrderItem[];
  address: string;
  paymentMethod: string;
  changeFor?: number;
  nomeCliente: string;
  telefone: string;
}

export interface Tamanho {
  nome: string;
  preco: number;

}


interface OrderContextType {
  createOrder: (orderData: OrderData) => Promise<string>;
  getOrderByCode: (code: string) => Order | null;
  getOrderById: (id: string) => Order | null;
  getAllOrders: () => Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { getProductById } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);

  const generateTrackingCode = (): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PED${randomNum}`;
  };


  const createOrder = async (orderData: OrderData): Promise<string> => {
    const { products: orderItems, address, paymentMethod, changeFor, nomeCliente, telefone } = orderData;
    const items = orderItems.map((item: OrderItem): PreparedItem => {

      const product = getProductById(item.productId) as ProductFromContext;

      if (!product) {

        throw new Error(`Produto com ID ${item.productId} não encontrado.`);
      }

      const size = product.tamanhos.find((t: Tamanho) => t.nome === item.size);


      if (!size) {
        throw new Error(`Tamanho '${item.size}' não encontrado para o produto '${product.nome}'.`);
      }

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




    const totalCalculadoLocalmente = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const trackingCode = generateTrackingCode();

    const newOrder: Order = {
      id: uuidv4(),
      trackingCode,
      items,
      address,
      paymentMethod,
      changeFor: changeFor ?? null,
      status: 'Pendente',
      total: totalCalculadoLocalmente
    };

    try {
      await api.post('/pedidos', {
        nomeCliente: nomeCliente,
        telefone: telefone,
        endereco: address,
        metodoPagamento: paymentMethod,
        produtos: items.map(item => ({
          produtoId: item.productId,
          tamanho: item.size,
          complementos: item.complements,
        }))
      });
      setOrders(prev => [newOrder, ...prev]);
      console.log(newOrder)
    } catch (error) {
      console.error('Erro ao enviar pedido para o backend:', error);

    }

    return trackingCode;
  };

  const getOrderByCode = (code: string): Order | null => {
    return orders.find(order => order.trackingCode === code) || null;
  };

  const getOrderById = async (id: string): Promise<Order> => {

    await api.get(`/pedidos/${id}`)
      .then(() => {
        console.log('Produto deletado com sucesso');
      })
      .catch((error) => {
        console.error('Erro ao deletar produto:', error);
      });
    return orders.find(order => order.id === id) || null;
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };


  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status } : order
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

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};