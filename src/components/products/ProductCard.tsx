import React from 'react';

interface ProductCardProps {
  product: {
    id: string;
    nome: string;
    descricao: string;
    imagem: string;
    tamanhos: Array<{
      rotulo: string;
      preco: number;
    }>;
  };
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const minPrice = Math.min(...product.tamanhos.map(t => t.preco));

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
          <div className="p-4 w-full">

          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-800">{product.nome}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.descricao}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline">
            <span className="text-sm text-gray-500"></span>
            <span className="ml-1 font-bold text-purple-700">R$ {minPrice.toFixed(2)}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;