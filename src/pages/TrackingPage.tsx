import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Order, useOrder } from '../contexts/OrderContext';
import OrderStatusTracker from '../components/orders/OrderStatusTracker';
import { PAYMENT_LABELS, formatBRL } from '../lib/orders';

const POLL_MS = 20000;

export const TrackingPage = () => {
  const { code } = useParams<{ code: string }>();
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Loads the order from the API and keeps polling for status changes until it is delivered
  useEffect(() => {
    if (!code) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      const data = await getOrderById(code);
      if (!active) return;
      setOrder(data);
      setLoading(false);
      if (data && data.status !== 'entregue') timer = setTimeout(load, POLL_MS);
    };
    load();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [code, getOrderById]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4 text-gray-600" aria-busy="true">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
        Buscando seu pedido...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">Confira o número do pedido ou tente novamente em instantes.</p>
          <Link to="/" className="bg-purple-600 text-white rounded-lg py-3 px-6 inline-block hover:bg-purple-700 transition-colors">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-purple-600 p-6 sm:p-8 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Olá, {order.nomeCliente}! Acompanhe seu pedido</h1>
          <p className="text-purple-100 text-lg">Pedido nº {order.id}</p>
        </div>

        <div className="p-6 sm:p-8">
          <OrderStatusTracker currentStatus={order.status} />
          {order.status !== 'entregue' && (
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <RefreshCw size={12} aria-hidden /> Esta página atualiza sozinha.
            </p>
          )}

          <div className="mt-10 border-t border-gray-200 pt-8 space-y-6">
            <h2 className="text-xl font-semibold">Detalhes do pedido</h2>
            <ul className="space-y-3">
              {order.produtos.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {item.produto.nome} ({item.tamanho})
                    </p>
                    {item.complementos.length > 0 && (
                      <p className="text-sm text-gray-500">{item.complementos.map((c) => c.complemento.nome).join(', ')}</p>
                    )}
                  </div>
                  <span className="font-medium whitespace-nowrap">{formatBRL(item.preco)}</span>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
              <div>
                <dt className="text-sm text-gray-500">Pagamento na entrega</dt>
                <dd className="font-medium">{PAYMENT_LABELS[order.metodoPagamento] ?? order.metodoPagamento}</dd>
                {order.metodoPagamento === 'dinheiro' && order.trocoPara ? (
                  <dd className="text-sm text-gray-500">Troco para {formatBRL(order.trocoPara)}</dd>
                ) : null}
              </div>
              <div className="text-right">
                <dt className="text-sm text-gray-500">Total</dt>
                <dd className="text-2xl font-bold">{formatBRL(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
