import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';



export const ProductsList = () => {
  const { products, deleteProduct, fetchProducts } = useProducts();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };


  useEffect(() => {
    fetchProducts();
  }, [location.key, fetchProducts]);

  return (
    <div>
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Gerenciar Produtos</h1>

      </div>
      <div className='flex justify-center'>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Novo Produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Não há produtos cadastrados.</p>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="mt-4 bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Adicionar Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img

                  src={product.imagem}
                  alt={product.nome}
  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
/>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.nome}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descricao}</p>

                <div className="flex items-center justify-between">

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit size={18} />
                    </button>

                    {deleteConfirm === product.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

