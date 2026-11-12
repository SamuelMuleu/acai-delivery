import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw, MapPin, CreditCard } from 'lucide-react';
import { Order, useOrder } from '../../contexts/OrderContext';
import { apiErrorMessage } from '../../contexts/api/api';
import { ORDER_STATUSES, OrderStatus, PAYMENT_LABELS, formatBRL, statusInfo } from '../../lib/orders';

function StatusSelect({ order, onChange }: { order: Order; onChange: (status: OrderStatus) => void }) {
  return (
    <select
      value={order.status}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      aria-label={`Status do pedido ${order.id}`}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

const Items = ({ order }: { order: Order }) => (
  <div>
    {order.produtos.map((item) => (
      <div key={item.id} className="mb-2 last:mb-0">
        <div className="font-medium">
          {item.produto.nome} ({item.tamanho})
        </div>
        {item.complementos.length > 0 && (
          <div className="pl-2 text-xs text-gray-500">{item.complementos.map((c) => c.complemento.nome).join(', ')}</div>
        )}
      </div>
    ))}
  </div>
);

export const OrdersList = () => {
  const { orders, fetchOrders, updateOrderStatus } = useOrder();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      await fetchOrders();
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível carregar os pedidos.'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, status);
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível atualizar o status.'));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar pedidos</h1>
        <button onClick={loadOrders} className="flex items-center bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors">
          <RefreshCw size={18} className="mr-2" aria-hidden />
          Atualizar
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" aria-label="Carregando" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">Não há pedidos no momento.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="md:hidden space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-purple-800">Pedido #{order.id}</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo(order.status).badge}`}>{statusInfo(order.status).label}</span>
                </div>
                <div className="text-sm">
                  <Items order={order} />
                </div>
                <div className="text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                  <p className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400 shrink-0" aria-hidden />{order.endereco}</p>
                  <p className="flex items-center"><CreditCard size={16} className="mr-2 text-gray-400 shrink-0" aria-hidden />{PAYMENT_LABELS[order.metodoPagamento]}</p>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <StatusSelect order={order} onChange={(s) => handleStatusChange(order, s)} />
                    <button onClick={() => navigate(`/admin/order/${order.id}`)} className="p-1 text-gray-500 hover:text-purple-600" aria-label={`Ver pedido ${order.id}`}>
                      <Eye size={20} />
                    </button>
                  </div>
                  <span className="font-bold text-xl text-gray-800">{formatBRL(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Pedido', 'Itens', 'Endereço', 'Pagamento', 'Total', 'Status', 'Ações'].map((h) => (
                    <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 align-top text-sm font-medium text-purple-700 whitespace-nowrap">
                      #{order.id}
                      <div className="text-xs font-normal text-gray-500">{new Date(order.criadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-gray-700"><Items order={order} /></td>
                    <td className="px-6 py-4 align-top text-sm text-gray-500 max-w-xs">{order.endereco}</td>
                    <td className="px-6 py-4 align-top text-sm text-gray-500 whitespace-nowrap">
                      {PAYMENT_LABELS[order.metodoPagamento]}
                      {order.trocoPara ? <div className="text-xs">Troco p/ {formatBRL(order.trocoPara)}</div> : null}
                    </td>
                    <td className="px-6 py-4 align-top text-sm font-medium text-gray-900 whitespace-nowrap">{formatBRL(order.total)}</td>
                    <td className="px-6 py-4 align-top text-sm whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo(order.status).badge}`}>{statusInfo(order.status).label}</span>
                    </td>
                    <td className="px-6 py-4 align-top text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusSelect order={order} onChange={(s) => handleStatusChange(order, s)} />
                        <button onClick={() => navigate(`/admin/order/${order.id}`)} className="p-1 text-purple-600 hover:text-purple-800" aria-label={`Ver pedido ${order.id}`}>
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
