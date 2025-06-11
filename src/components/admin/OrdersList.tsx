import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, RefreshCw } from "lucide-react";
import { Order, useOrder } from "../../contexts/OrderContext";




export const OrdersList = () => {
  const { orders: contextOrders, fetchOrders, updateOrderStatus } = useOrder();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    updateOrderStatus(orderId, newStatus);
    await loadOrders();
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "em preparo":
        return "bg-blue-100 text-blue-800";
      case "pronto":
        return "bg-green-100 text-green-800";
      case "saiu para entrega":
        return "bg-purple-100 text-purple-800";
      case "entregue":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-200 text-gray-700";
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
        <button
          onClick={loadOrders}
          className="flex items-center bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors"
        >
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 md:divide-y-0">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {contextOrders.map((order: Order) => (
                  <tr key={order.id} className="block md:table-row border-b border-gray-200 md:border-b-0 hover:bg-gray-50 mb-4 md:mb-0 shadow-md md:shadow-none rounded-lg md:rounded-none">
                    <td className="px-6 py-4 whitespace-nowrap text-sm block md:table-cell text-right md:text-left border-b md:border-b-0">
                      <span className="font-semibold md:hidden mr-2">Código:</span>
                      <span className="font-medium text-purple-700">{`PED${order.id}` || `PED${order.id}` || 'N/A'}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-normal text-sm block md:table-cell text-right md:text-left border-b md:border-b-0">
                      <span className="font-semibold md:hidden mr-2">Itens:</span>
                      <div className="inline-block text-gray-700 md:text-left">
                        {order.produtos && order.produtos.length > 0 ? (
                          order.produtos.map((produtoPedido, prodIndex) => (
                            <div key={produtoPedido.id || prodIndex} className="mb-2 last:mb-0"> 
                              <div className="font-medium">
                                {produtoPedido.quantity || 1}x {produtoPedido.produto.nome} {produtoPedido.tamanho ? `(${produtoPedido.tamanho})` : ''}
                              </div>
                              {produtoPedido.complementos && produtoPedido.complementos.length > 0 && (
                                <div className="pl-2 text-xs text-gray-600">
                                  {produtoPedido.complementos.map((compEscolhido:any, compIndex:any) => (
                                    <div key={compEscolhido.id || compIndex}> {/* Usa compEscolhido.id se disponível */}
                                      {compEscolhido.complemento.tipo.toLowerCase() === 'fruta' ? (
                                        <span>Batido com: {compEscolhido.complemento.nome}</span>
                                      ) : (
<span>{capitalizeFirstLetter(compEscolhido.complemento.tipo)}: {capitalizeFirstLetter(compEscolhido.complemento.nome)}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-normal text-sm block md:table-cell text-right md:text-left border-b md:border-b-0 max-w-full md:max-w-xs md:truncate" title={order.endereco}>
                      <span className="font-semibold md:hidden mr-2">Endereço:</span>
                      <span className="text-gray-500">{order.endereco || 'N/A'}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm block md:table-cell text-right md:text-left border-b md:border-b-0">
                      <span className="font-semibold md:hidden mr-2">Pagamento:</span>
                      <span className="text-gray-500">{order.metodoPagamento || 'N/A'}</span>
                      {order.metodoPagamento?.toLowerCase() === 'dinheiro' && typeof order.changeFor === 'number' && order.changeFor > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          (Troco p/ R$ {order.changeFor.toFixed(2).replace('.', ',')})
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm block md:table-cell text-right md:text-left border-b md:border-b-0">
                      <span className="font-semibold md:hidden mr-2">Total:</span>
                      <span className="font-medium text-gray-900">{typeof order.total === 'number' ? `R$ ${order.total.toFixed(2).replace('.', ',')}` : 'N/A'}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap block md:table-cell text-right md:text-left border-b md:border-b-0">
                      <span className="font-semibold md:hidden mr-2">Status:</span>
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm block md:table-cell text-right md:text-left">
                      <span className="font-semibold md:hidden mr-2">Ações:</span>
                      <div className="flex items-center space-x-2 justify-end md:justify-start">
                        <select
                          value={order.status || ''}
                          onChange={(e) =>
                            handleStatusChange(order.id.toString(), e.target.value as Order['status'])
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em preparo">Em Preparo</option>
                          <option value="pronto">Pronto</option>
                          <option value="saiu para entrega">Saiu para entrega</option>
                          <option value="entregue">Entregue</option>
                        </select>
                        <button
                          onClick={() => navigate(`/admin/order/${order.id}`)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Ver Detalhes"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};