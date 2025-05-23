import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';

const ComplementsList: React.FC = () => {
  const { getComplements, deleteComplement } = useProducts();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const complements = getComplements();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    deleteComplement(id);
    setDeleteConfirm(null);
  };

  // Group complements by type
  const complementsByType = complements.reduce((acc, complement) => {
    if (!acc[complement.tipo]) {
      acc[complement.tipo] = [];
    }
    acc[complement.tipo].push(complement);
    return acc;
  }, {} as { [key: string]: typeof complements });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Complementos</h1>
        <button
          onClick={() => navigate('/admin/complements/new')}
          className="flex items-center bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Novo Complemento
        </button>
      </div>

      {complements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Não há complementos cadastrados.</p>
          <button
            onClick={() => navigate('/admin/complements/new')}
            className="mt-4 bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Adicionar Complemento
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(complementsByType).map(([tipo, items]) => (
            <div key={tipo} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-50 py-3 px-6 border-b">
                <h2 className="font-semibold text-purple-800">{tipo}</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map((complement) => (
                    <div key={complement.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{complement.nome}</h3>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={() => navigate(`/admin/complements/edit/${complement.id}`)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          
                          {deleteConfirm === complement.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDelete(complement.id)}
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
                              onClick={() => setDeleteConfirm(complement.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplementsList;