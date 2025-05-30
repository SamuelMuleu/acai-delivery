import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { StoreStatus } from '../components/layout/StoreStatus';

export const HomePage = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-white">
      <StoreStatus />
      {/* Conteúdo da página */}
      <main className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};


