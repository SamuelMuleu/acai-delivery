import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useProducts } from "./ProductsContext";
import { api } from "./api/api";

export interface OrderItem {
  productId: string;
  size: string;
  complements: number[];
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
  complements: number[];
  quantity: number;
}
interface Produto {
  nome: string;

}
interface Complemento {
  nome: string;
  tipo: string; 
}

interface ComplementoEscolhido {

  complemento: Complemento;
}
interface ProdutoPedido {
   id?: string | number;
  quantity?: number;  
  produto: Produto;
  tamanho?: string;    
  complementos?: ComplementoEscolhido[]; 
}

export interface Order {
  id: string;
  trackingCode?: string;
  nomeCliente: string;
  telefone: string;
   produtos?: ProdutoPedido[]; 
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
  products: OrderItem[];
  endereco: string; 
  metodoPagamento: string;
  changeFor?: number;
  nomeCliente: string;
  telefone: string;
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
      products: orderItemsInput,
      endereco: addressInput, 
      metodoPagamento: paymentMethodInput,
      changeFor: changeForInput,
      nomeCliente,
      telefone,
    } = orderData;

    const processedItems = orderItemsInput.map((item: OrderItem): PreparedItem => {
      const product = getProductById(item.productId) as ProductFromContext;
      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado.`);
      }
      const sizeInfo = product.tamanhos.find((t: Tamanho) => t.nome === item.size);
      if (!sizeInfo) {
        throw new Error(
          `Tamanho '${item.size}' não encontrado para o produto '${product.nome}'.`
        );
      }
      return {
        productId: item.productId,
        name: product.nome,
        image: product.imagem,
        size: item.size,
        price: sizeInfo.preco,
        complements: item.complements,
        quantity: item.quantity,
      };
    });

    const orderTrackingCode = generateTrackingCode();
    const orderId = uuidv4();
    const orderCreationDate = new Date().toISOString();
    const orderTotal = processedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: orderId,
      trackingCode: orderTrackingCode,
      nomeCliente,
      telefone,
      endereco: addressInput,
      metodoPagamento: paymentMethodInput,
      criadoEm: orderCreationDate,
      status: "pendente",
      items: processedItems,
      total: orderTotal,
      changeFor: changeForInput ?? undefined,
    };

    try {
      await api.post("/pedidos", {
        nomeCliente: newOrder.nomeCliente,
        telefone: newOrder.telefone,
        endereco: newOrder.endereco,
        metodoPagamento: newOrder.metodoPagamento,
        // criadoEm: newOrder.criadoEm, // O backend geralmente define isso
        // status: newOrder.status, // O backend geralmente define o status inicial
        // trackingCode: newOrder.trackingCode, // Se o backend precisar/gerar
        // total: newOrder.total, // Se o backend calcular ou precisar
        // changeFor: newOrder.changeFor, // Se o backend precisar
        produtos: newOrder.items?.map((item) => ({
          produtoId: parseInt(item.productId, 10), // Convertido para número
          tamanho: item.size,
         complementos: item.complements, 
          // quantidade: item.quantity, // Se o backend esperar
          // preco: item.price, // Se o backend esperar
        })),
      });
      setOrders((prev) => [newOrder, ...prev]);
    } catch (error) {
      console.error("Erro ao enviar pedido para o backend:", error);
      throw error;
    }

    return newOrder.trackingCode || newOrder.id;
  };

  const getOrderByCode = (code: string): Order | null => {
    return orders.find((order) => order.trackingCode === code || order.id === code) || null;
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data as Order;
    } catch (error: unknown) {
      console.error("Erro ao buscar Pedido por ID:", error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/pedidos");
      setOrders(response.data as Order[]);
    } catch (error) {
      console.error("Erro ao buscar Pedidos:", error);
    }
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      // Adicionar chamada à API para atualizar o status no backend
      // await api.patch(`/pedidos/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
    }
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