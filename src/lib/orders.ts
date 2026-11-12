/** Order statuses exactly as stored by the API. */
export type OrderStatus = 'pendente' | 'preparo' | 'saiu' | 'entregue';

export const ORDER_STATUSES: { key: OrderStatus; label: string; message: string; badge: string }[] = [
  { key: 'pendente', label: 'Recebido', message: 'Seu pedido foi recebido e está aguardando confirmação.', badge: 'bg-yellow-100 text-yellow-800' },
  { key: 'preparo', label: 'Em preparo', message: 'Estamos preparando seu açaí!', badge: 'bg-blue-100 text-blue-800' },
  { key: 'saiu', label: 'Saiu para entrega', message: 'O entregador está a caminho com seu pedido!', badge: 'bg-purple-100 text-purple-800' },
  { key: 'entregue', label: 'Entregue', message: 'Seu pedido foi entregue. Bom apetite!', badge: 'bg-gray-100 text-gray-800' },
];

export const statusInfo = (status: string) => ORDER_STATUSES.find((s) => s.key === status) ?? ORDER_STATUSES[0];

export const PAYMENT_LABELS: Record<string, string> = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão' };

export const formatBRL = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
