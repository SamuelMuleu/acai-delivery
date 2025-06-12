import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, RefreshCw, MapPin, CreditCard } from "lucide-react";
import { Order, useOrder } from "../../contexts/OrderContext";

// Supondo que a interface ProdutoPedido foi exportada do OrderDetails ou está em um arquivo compartilhado
// Se não, você pode defini-la aqui novamente.
interface ProdutoPedido {
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

export const OrdersList = () => {
  const { orders: contextOrders, fetchOrders, updateOrderStatus } = useOrder();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Esta função está correta, calcula o total de UM pedido.
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

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      await fetchOrders();
    } catch (error) {
      console.error("Erro ao carregar pedidos no componente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "em preparo": return "bg-blue-100 text-blue-800";
      case "pronto": return "bg-green-100 text-green-800";
      case "saiu para entrega": return "bg-purple-100 text-purple-800";
      case "entregue": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  const capitalizeFirstLetter = (string?: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Pedidos</h1>
        <button onClick={loadOrders} className="flex items-center bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors">
          <RefreshCw size={18} className="mr-2" />
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : !contextOrders || contextOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Não há pedidos no momento.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 md:divide-y-0">
              {contextOrders.map((order: Order) => {
          
                const totalPedido = calculateOrderTotal(order);

                return (
                  <tr key={order.id} className="block md:table-row">
                    
                    <td colSpan={7} className="block md:hidden p-0 border-b border-gray-200">
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-purple-800">{`PEDIDO #${order.id}`}</span>
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>{capitalizeFirstLetter(order.status)}</span>
                        </div>
                        <div>
                          {(order.produtos as ProdutoPedido[])?.map((item, index) => (
                            <div key={index} className="mb-2 last:mb-0 text-sm">
                              <div className="font-medium text-gray-800">{item.produto.nome} ({item.tamanho})</div>
                              {item.complementos && item.complementos.length > 0 && (
                                <div className="text-sm text-gray-500 pl-2">{item.complementos.map(c => c.complemento.nome).join(', ')}</div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                          <div className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400 flex-shrink-0" /><span>{order.endereco || 'N/A'}</span></div>
                          <div className="flex items-center"><CreditCard size={16} className="mr-2 text-gray-400 flex-shrink-0" /><span>{order.metodoPagamento || 'N/A'}</span></div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                          <div className="flex items-center space-x-2">
                            <select value={order.status || ''} onChange={(e) => handleStatusChange(order.id.toString(), e.target.value as Order['status'])} className="border border-gray-300 rounded px-2 py-1 text-sm">
                              <option value="pendente">Pendente</option><option value="em preparo">Em Preparo</option><option value="pronto">Pronto</option><option value="saiu para entrega">Saiu para entrega</option><option value="entregue">Entregue</option>
                            </select>
                            <button onClick={() => navigate(`/admin/order/${order.id}`)} className="text-gray-500 hover:text-purple-600" title="Ver Detalhes"><Eye size={20} /></button>
                          </div>
                          <div className="text-right"><span className="font-bold text-xl text-gray-800">R$ {totalPedido.toFixed(2).replace('.', ',')}</span></div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap align-top text-sm font-medium text-purple-700">{`PED${order.id}`}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-normal align-top text-sm text-gray-700">
                      <div>
                        {(order.produtos as ProdutoPedido[])?.map((item, index) => (
                          <div key={index} className="mb-2 last:mb-0">
                            <div className="font-medium">{item.produto.nome} {item.tamanho ? `(${item.tamanho})` : ''}</div>
                            <div className="pl-2 text-xs text-gray-500">{item.complementos?.map((comp) => comp.complemento.nome).join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-normal align-top text-sm text-gray-500 max-w-xs truncate" title={order.endereco}>{order.endereco || 'N/A'}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap align-top text-sm text-gray-500">
                      <div><span>{order.metodoPagamento || 'N/A'}</span></div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap align-top text-sm font-medium text-gray-900">R$ {totalPedido.toFixed(2).replace('.', ',')}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap align-top text-sm"><span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>{capitalizeFirstLetter(order.status)}</span></td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap align-top text-sm">
                      <div className="flex items-center space-x-2">
                        <select value={order.status || ''} onChange={(e) => handleStatusChange(order.id.toString(), e.target.value as Order['status'])} className="border border-gray-300 rounded px-2 py-1 text-sm">
                          <option value="pendente">Pendente</option><option value="em preparo">Em Preparo</option><option value="pronto">Pronto</option><option value="saiu para entrega">Saiu para entrega</option><option value="entregue">Entregue</option>
                        </select>
                        <button onClick={() => navigate(`/admin/order/${order.id}`)} className="text-purple-600 hover:text-purple-800" title="Ver Detalhes"><Eye size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};