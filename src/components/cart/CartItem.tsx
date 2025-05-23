import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { initialComplements } from '../../contexts/ProductsContext';


interface CartItemProps {
  item: {
    productId: string;
    name: string;
    image: string;
    size: string;
    price: number;
    complements: string[];
    quantity: number;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {

  const getComplementName = (id: string) => {
    const complement = initialComplements.find(c => c.id === id);
    return complement ? complement.nome : id; // Retorna o ID se não encontrar o complemento
  };

  return (
    <div className="py-4 flex">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-800">
            <h3>{item.name}</h3>
            <p className="ml-4">R$ {(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">Tamanho: {item.size}</p>
          {item.complements.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Complementos: {item.complements
                .map(id => getComplementName(id))
                .join(', ')}
            </p>
          )}
        </div>

        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
              className="p-1 text-gray-600 hover:text-purple-600"
            >
              <Minus size={16} />
            </button>
            <span className="px-2 py-1 min-w-[32px] text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="p-1 text-gray-600 hover:text-purple-600"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;