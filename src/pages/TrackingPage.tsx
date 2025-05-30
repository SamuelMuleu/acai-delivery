import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, PreparedItem, useOrder } from '../contexts/OrderContext';
import OrderStatusTracker from '../components/orders/OrderStatusTracker';

export const TrackingPage = () => {
  const { code } = useParams<{ code: string }>();
  const { getOrderByCode } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      const orderData = getOrderByCode(code);
      setOrder(orderData);
      setLoading(false);
    }
  }, [code, getOrderByCode]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Pedido não encontrado</h2>
          <p className="text-gray-600 mb-6">O código de rastreamento informado não existe ou expirou.</p>
          <Link
            to="/"
            className="bg-purple-600 text-white rounded-lg py-3 px-6 inline-block hover:bg-purple-700 transition-colors"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-purple-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Acompanhe seu pedido</h1>
            <div className="text-purple-200 text-lg">Código: {order.trackingCode}</div>
          </div>

          <div className="p-8">
            <OrderStatusTracker currentStatus={order.status} />

            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold mb-4">Detalhes do Pedido</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Itens</h3>
                  <div className="space-y-2">
                    {order.items.map((item: PreparedItem) => (
                      <div key={item.productId} className="flex justify-between">
                        <span>{item.quantity}x {item.name} ({item.size})</span>
                        <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Endereço de entrega</h3>
                  <p>{order.address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Forma de pagamento</h3>
                  <p>{order.paymentMethod}</p>
                  {order.paymentMethod === 'Dinheiro' && order.changeFor && (
                    <p className="text-sm text-gray-500">Troco para: R$ {order.changeFor.toFixed(2)}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total</h3>
                  <p className="text-xl font-semibold">R$ {order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Voltar para a loja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

