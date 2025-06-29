import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone } from 'lucide-react';
import { Order, useOrder } from '../../contexts/OrderContext';
import OrderStatusTracker from '../orders/OrderStatusTracker';


export interface ProdutoPedido {
  id: number;
  preco: number;
  produto: { nome: string };
  tamanho?: string;
  complementos: Array<{
    complemento: {
      id: number;
      nome: string;
      tipo: string;
      preco: number;
    };
  }>;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateOrderTotal = (order: Order) => {
    if (!order || !order.produtos) return 0;
    
    return (order.produtos as ProdutoPedido[]).reduce((total, produtoPedido) => {
      let itemTotal = produtoPedido.preco || 0;
      if (produtoPedido.complementos) {
        itemTotal += produtoPedido.complementos.reduce((compTotal, comp) => {
          return compTotal + (comp.complemento?.preco || 0);
        }, 0);
      }
      return total + itemTotal;
    }, 0);
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const data = await getOrderById(id); 
          setOrder(data);
        } catch (error) {
          console.error("Erro ao buscar dados do pedido:", error);
          setOrder(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setOrder(null); 
        setIsLoading(false);
      }
    };
  
    fetchOrderData(); 
  }, [id, getOrderById]);

  const handleStatusChange = (newStatus: Order['status']) => {
    if (id) {
      updateOrderStatus(id, newStatus);
      setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-8">Pedido não encontrado.</div>;
  }

  const totalPedido = calculateOrderTotal(order);

  return (
    <div>
      <button onClick={() => navigate('/admin')} className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors">
        <ChevronLeft size={20} className="mr-1" />
        Voltar para lista de pedidos
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.id}</h1>
              <p className="text-gray-500 mt-1">
          
                Data: {new Date(order.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Atualizar status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
        
                <option value="pendente">Pendente</option>
                <option value="em preparo">Em Preparo</option>
                <option value="pronto">Pronto</option>
                <option value="saiu para entrega">Saiu para Entrega</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <OrderStatusTracker currentStatus={order.status} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Detalhes do Pedido</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-gray-700">Itens</h3>
                <div className="space-y-4">
                
                  {(order.produtos as ProdutoPedido[])?.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{item.produto.nome} ({item.tamanho})</div>
                        {item.complementos && item.complementos.length > 0 && (
                          <div className="text-sm text-gray-500 pl-2">
                            {item.complementos.map(c => c.complemento.nome).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-right">R$ {item.preco.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                 
                    <span>R$ {totalPedido.toFixed(2).replace('.',',')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Informações do Cliente</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
             
                <div className="flex items-center">
                    <User size={16} className="mr-3 text-gray-500"/>
                    <p className="text-gray-700">{order.nomeCliente}</p>
                </div>
                <div className="flex items-center">
                    <Phone size={16} className="mr-3 text-gray-500"/>
                    <p className="text-gray-700">{order.telefone}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Endereço de Entrega</h3>
                  <p className="text-gray-700">{order.endereco}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Método de Pagamento</h3>
                  <p className="text-gray-700 capitalize">{order.metodoPagamento}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;