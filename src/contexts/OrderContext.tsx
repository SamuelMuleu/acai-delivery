import React, { createContext, useContext, useState, ReactNode } from "react";
import { useProducts } from "./ProductsContext";

import { api } from "./api/api";

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
  nomeCliente: string;
  telefone: string;
  endereco: string;
  metodoPagamento: string;
  criadoEm: string;
  status:
    | "pendente"
    | "em preparo"
    | "pronto"
    | "saiu para entrega"
    | "entregue";
  items?: PreparedItem[];
  total?: number;
  changeFor?: number;
}

interface OrderData {
  id:string;
  products: OrderItem[];
  endereco: string;
  metodoPagamento: string;
  changeFor?: number;
  nomeCliente: string;
  telefone: string;
  criadoEm:string;
}

export interface Tamanho {
  nome: string;
  preco: number;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: OrderData) => Promise<string>;
  getOrderByCode: (code: string) => Order | null;
  getOrderById: (id: string) => Promise<Order | null>;
  getAllOrders: () => Order[];
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getProductById } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);

  const generateTrackingCode = (): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PED${randomNum}`;
  };

  const createOrder = async (orderData: OrderData): Promise<string> => {
    const {
      products: orderItems,
      id,
      endereco,
      metodoPagamento,
      nomeCliente,
      telefone,
      criadoEm,
    } = orderData;
    const items = orderItems.map((item: OrderItem): PreparedItem => {
      const product = getProductById(item.productId) as ProductFromContext;

      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado.`);
      }

      const size = product.tamanhos.find((t: Tamanho) => t.nome === item.size);

      if (!size) {
        throw new Error(
          `Tamanho '${item.size}' não encontrado para o produto '${product.nome}'.`
        );
      }

      return {
        productId: item.productId,
        name: product.nome,
        image: product.imagem,
        size: item.size,
        price: size.preco,
        complements: item.complements,
        quantity: item.quantity,
      };
    });

    const trackingCode = generateTrackingCode();

    const newOrder: Order = {
      id,
      nomeCliente,
      endereco,
      criadoEm,
      metodoPagamento,
      telefone,
      status: "pendente",
    };

    try {
      await api.post("/pedidos", {
        nomeCliente: nomeCliente,
        telefone: telefone,
        endereco: endereco,
        metodoPagamento: metodoPagamento,
        produtos: items.map((item) => ({
          produtoId: item.productId,
          tamanho: item.size,
          complementos: item.complements,
        })),
      });
      setOrders((prev) => [newOrder, ...prev]);
    } catch (error) {
      console.error("Erro ao enviar pedido para o backend:", error);
    }

    return trackingCode;
  };

  const getOrderByCode = (code: string): Order | null => {
    return orders.find((order) => order.id === code) || null;
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/pedidos/${id}`);

      setOrders(response.data);
    } catch (error: unknown) {
      console.error("Erro ao buscar Produtos:", error);
    }
    return orders.find((order) => order.id === id) || null;
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/pedidos");
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao buscar Pedidos:", error);
    }
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderByCode,
        getOrderById,
        getAllOrders,
        updateOrderStatus,
        fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
