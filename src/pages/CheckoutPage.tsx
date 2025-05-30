import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import CartItem from '../components/cart/CartItem';
import AddressForm from '../components/checkout/AddressForm';
import PaymentMethod from '../components/checkout/PaymentMethod';

export const CheckoutPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartão'>('pix');
  const [changeFor, setChangeFor] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: { [key: string]: string } = {};


    if (!nomeCliente.trim()) {
      errors.nomeCliente = 'Nome do cliente é obrigatório';
    }
    if (!telefone.trim()) {
      errors.telefone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(telefone.trim().replace(/\D/g, ''))) {
      errors.telefone = 'Telefone inválido (apenas números, 10 ou 11 dígitos)';
    }

    if (!address.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (paymentMethod === 'dinheiro' && (!changeFor || changeFor <= 0)) {
      errors.changeFor = 'Informe um valor válido para o troco';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const getProcessedChangeFor = (value: string | number | null): number | undefined => {
      if (value === null || value === '') {
        return undefined;
      }
      if (typeof value === 'string') {
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
      }
      return value;
    };

    try {
      const trackingCode = await createOrder({
        products: cart.map(item => ({
          productId: item.productId,
          size: item.size,
          complements: item.complements,
          quantity: item.quantity
        })),
        address,
        paymentMethod,
        changeFor: paymentMethod === 'dinheiro' ? getProcessedChangeFor(changeFor) : undefined,
        nomeCliente: nomeCliente,
        telefone: telefone
      });

      clearCart();
      navigate(`/tracking/${trackingCode}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      setIsSubmitting(false);
      setFormErrors({ general: 'Erro ao criar pedido. Tente novamente.' });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione alguns produtos para continuar.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white rounded-lg py-3 px-6 hover:bg-purple-700 transition-colors"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar
      </button>

      <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Itens do Carrinho</h2>

            </div>

            <div className="divide-y">
              {cart.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size}-${item.complements.join('-')}`}
                  item={item}
                  onRemove={() => removeFromCart(item)}
                  onUpdateQuantity={(quantity) => updateQuantity(item, quantity)}
                />
              ))}
            </div>
          </div>



          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label htmlFor="nomeCliente" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nomeCliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${formErrors.nomeCliente ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Seu nome completo"
              />
              {formErrors.nomeCliente && (
                <p className="mt-1 text-sm text-red-500">{formErrors.nomeCliente}</p>
              )}
            </div>

            {/* Campo Telefone */}
            <div className="mb-4">
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (com DDD)
              </label>
              <input
                type="tel" // Use type="tel" para melhor usabilidade em mobile
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${formErrors.telefone ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="(XX) XXXXX-XXXX"
              />
              {formErrors.telefone && (
                <p className="mt-1 text-sm text-red-500">{formErrors.telefone}</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
              <AddressForm
                address={address}
                setAddress={setAddress}
                error={formErrors.address}
              />
            </div>



            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <PaymentMethod
                  id="pix"
                  label="Pix"
                  icon={<QrCode size={24} />}
                  selected={paymentMethod === 'pix'}
                  onClick={() => setPaymentMethod('pix')}
                />
                <PaymentMethod
                  id="money"
                  label="Dinheiro"
                  icon={<Banknote size={24} />}
                  selected={paymentMethod === 'dinheiro'}
                  onClick={() => setPaymentMethod('dinheiro')}
                />
                <PaymentMethod
                  id="card"
                  label="Cartão"
                  icon={<CreditCard size={24} />}
                  selected={paymentMethod === 'cartão'}
                  onClick={() => setPaymentMethod('cartão')}
                />
              </div>

              {paymentMethod === 'dinheiro' && (
                <div className="mb-4">
                  <label htmlFor="changeFor" className="block text-sm font-medium text-gray-700 mb-1">
                    Troco para
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      R$
                    </span>
                    <input
                      type="number"
                      id="changeFor"
                      value={changeFor || ''}
                      onChange={(e) => setChangeFor(parseFloat(e.target.value) || null)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${formErrors.changeFor ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formErrors.changeFor && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.changeFor}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white rounded-lg py-3 px-6 font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                    Processando...
                  </span>
                ) : (
                  'Confirmar Pedido'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.complements.join('-')}`} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name} ({item.size})
                  </span>
                  <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Tempo estimado de entrega: 30-45 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

