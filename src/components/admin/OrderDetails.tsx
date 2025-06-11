import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Order, PreparedItem, useOrder } from '../../contexts/OrderContext';
import OrderStatusTracker from '../orders/OrderStatusTracker';


const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);


  useEffect(() => {
    
    const fetchOrderData = async () => {
      if (id) {
        try {
          const data = await getOrderById(id); 
          setOrder(data);                      
        } catch (error) {
          console.error("Erro ao buscar dados do pedido:", error);
          setOrder(null);
        }
      } else {
        setOrder(null); 
      }
    };
  
    fetchOrderData(); 
  
  }, [id, getOrderById]);

  const handleStatusChange = (newStatus: Order['status']) => {
    if (id) {
      updateOrderStatus(id, newStatus);
      setOrder((prev) => {
        if (!prev) return null;
        return { ...prev, status: newStatus };
      });
    }
  };

  if (!order) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar para lista de pedidos
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Pedido #{order.id}
              </h1>
              <p className="text-gray-500 mt-1">
                Data: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atualizar status
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Preparo">Em Preparo</option>
                <option value="Pronto">Pronto</option>
                <option value="Saiu para entrega">Saiu para entrega</option>
                <option value="Entregue">Entregue</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <OrderStatusTracker currentStatus={order.status} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Detalhes do Pedido</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Itens</h3>
                <div className="space-y-3">
                  {order?  order.items?.map((item: PreparedItem, index: number) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div className="font-medium">{item.quantity}x {item.name} ({item.size})</div>
                        {item.complements && item.complements.length > 0 && (
                          <div className="text-sm text-gray-500">
                            Complementos: {item.complements.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )):<div></div>}
                </div>


                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Informações do Cliente</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Endereço de Entrega</h3>
                  <p className="text-gray-700">{order.endereco}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Método de Pagamento</h3>
                  <p className="text-gray-700">{order.metodoPagamento}</p>
                  {order.metodoPagamento === 'Dinheiro' && order.changeFor && (
                    <p className="text-gray-500 text-sm">Troco para: R$ {order.changeFor.toFixed(2)}</p>
                  )}
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