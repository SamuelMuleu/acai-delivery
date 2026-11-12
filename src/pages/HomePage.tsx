import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { StoreStatus } from '../components/layout/StoreStatus';

export const HomePage = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-white">
      <StoreStatus />
      <main className="px-4 py-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Cardápio</h1>

        {loading ? (
          <ul className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando cardápio">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-28 rounded-xl bg-purple-50 animate-pulse" />
            ))}
            <li className="text-center text-sm text-gray-500">
              Carregando o cardápio... no primeiro acesso isso pode levar até um minuto.
            </li>
          </ul>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center gap-4 rounded-xl border border-purple-100 bg-purple-50 px-6 py-12 text-center">
            <p className="text-gray-700">{error}</p>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-700"
            >
              <RefreshCw size={16} aria-hidden /> Tentar novamente
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Nenhum produto disponível no momento.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
