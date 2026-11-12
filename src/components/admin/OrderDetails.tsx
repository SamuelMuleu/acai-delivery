import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone } from 'lucide-react';
import { Order, useOrder } from '../../contexts/OrderContext';
import { apiErrorMessage } from '../../contexts/api/api';
import OrderStatusTracker from '../orders/OrderStatusTracker';
import { ORDER_STATUSES, OrderStatus, PAYMENT_LABELS, formatBRL } from '../../lib/orders';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getOrderById(id).then((data) => {
      setOrder(data);
      setIsLoading(false);
    });
  }, [id, getOrderById]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    const previous = order.status;
    setOrder({ ...order, status });
    try {
      await updateOrderStatus(order.id, status);
      setError('');
    } catch (err) {
      setOrder({ ...order, status: previous });
      setError(apiErrorMessage(err, 'Não foi possível atualizar o status.'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" aria-label="Carregando" />
      </div>
    );
  }

  if (!order) return <div className="text-center py-8">Pedido não encontrado.</div>;

  return (
    <div>
      <button onClick={() => navigate('/admin')} className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors">
        <ChevronLeft size={20} className="mr-1" aria-hidden />
        Voltar para a lista de pedidos
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.id}</h1>
            <p className="text-gray-500 mt-1">{new Date(order.criadoEm).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Atualizar status</label>
            <select
              id="status"
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
          <OrderStatusTracker currentStatus={order.status} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Itens</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-4">
                  {order.produtos.map((item) => (
                    <li key={item.id} className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-medium">{item.produto.nome} ({item.tamanho})</div>
                        {item.complementos.length > 0 && (
                          <div className="text-sm text-gray-500 pl-2">{item.complementos.map((c) => c.complemento.nome).join(', ')}</div>
                        )}
                      </div>
                      <div className="font-medium whitespace-nowrap">{formatBRL(item.preco)}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatBRL(order.total)}</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Cliente</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <p className="flex items-center"><User size={16} className="mr-3 text-gray-500" aria-hidden />{order.nomeCliente}</p>
                <p className="flex items-center">
                  <Phone size={16} className="mr-3 text-gray-500" aria-hidden />
                  <a href={`https://wa.me/55${order.telefone}`} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">
                    {order.telefone}
                  </a>
                </p>
                <div>
                  <h3 className="font-medium mb-1">Endereço de entrega</h3>
                  <p className="text-gray-700">{order.endereco}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Pagamento</h3>
                  <p className="text-gray-700">
                    {PAYMENT_LABELS[order.metodoPagamento]}
                    {order.trocoPara ? ` (troco para ${formatBRL(order.trocoPara)})` : ''}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
