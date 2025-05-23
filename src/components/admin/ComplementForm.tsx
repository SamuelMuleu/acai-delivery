import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';

const ComplementForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getComplementById, createComplement, updateComplement } = useProducts();
  
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Fruta'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const complement = getComplementById(id);
      if (complement) {
        setFormData({
          nome: complement.nome,
          tipo: complement.tipo
        });
      }
    }
  }, [id, getComplementById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (id) {
        updateComplement(id, formData);
      } else {
        createComplement(formData);
      }
      
      navigate('/admin/complements');
    } catch (error) {
      console.error('Failed to save complement:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => navigate('/admin/complements')}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar para lista de complementos
      </button>
      
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Editar Complemento' : 'Novo Complemento'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.nome ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
            </div>
            
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="Fruta">Fruta</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Adicional">Adicional</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/complements')}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Complemento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplementForm;