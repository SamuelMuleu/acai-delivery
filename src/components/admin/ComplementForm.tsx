import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import axios from 'axios';



const ComplementForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // As funções createComplement e updateComplement são obtidas do contexto
  const { getComplementById, createComplement, updateComplement } = useProducts();

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Fruta',
    preco: 0, // Campo de preço adicionado novamente
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // Para exibir erros da API

  useEffect(() => {
    if (id) {
      const complement = getComplementById(id);
      if (complement) {
        setFormData({ ...complement });
      } else {
        axios.get(`/complementos/${id}`)
          .then(res => setFormData(res.data))
          .catch(err => {
            console.error('Complemento não encontrado:', err);
            navigate('/admin/complements');
          });
      }
    }
  }, [id, getComplementById, navigate]);

  // Lida com a mudança nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Converte o valor do preço para número
    setFormData(prev => ({ ...prev, [name]: name === 'preco' ? parseFloat(value) || 0 : value }));
  };

  // Valida os campos do formulário
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (formData.preco < 0) {
      newErrors.preco = 'Preço não pode ser negativo';
    }
    // O tipo já tem um valor padrão, então a validação pode ser menos rigorosa aqui.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Lida com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida o formulário antes de submeter
    if (!validateForm()) {
      setApiError(null); // Limpa qualquer erro da API se houver erros de validação locais
      return;
    }

    setIsSubmitting(true);
    setApiError(null); // Limpa erros anteriores da API antes de uma nova tentativa

    try {
      if (id) {
        // Se há um ID, está editando um complemento existente
        await updateComplement(id, formData);
      } else {
        // Se não há ID, está criando um novo complemento
        await createComplement(formData);
      }
      // Navega de volta para a lista de complementos após o sucesso
      navigate('/admin/complements');
    } catch (error: unknown) {
      console.error('Failed to save complement:', error);

      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
        setApiError(error.response.data.error);
      } else if (error instanceof Error) {
        setApiError('Erro ao salvar complemento: ' + error.message);
      } else {
        setApiError('Erro desconhecido ao salvar complemento. Tente novamente.');
      }
    } finally {
      // Sempre define isSubmitting como false, independentemente do sucesso ou falha
      setIsSubmitting(false);
    }
  };
  console.log('Dados enviados:', formData);


  return (
    <div className="container mx-auto px-4 py-8">
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
            {/* Campo Nome */}
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Nome do complemento"
              />
              {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
            </div>

            {/* Campo Preço */}
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${errors.preco ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.preco && <p className="mt-1 text-sm text-red-500">{errors.preco}</p>}
            </div>

            {/* Campo Tipo */}
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
                <option value="fruta">fruta</option>
                <option value="cobertura">cobertura</option>
                <option value="adicional">adicional</option>
              </select>
            </div>
          </div>

          {/* Exibição de erro da API */}
          {apiError && (
            <p className="mt-4 text-sm text-red-600 text-center font-semibold">{apiError}</p>
          )}

          {/* Botões de Ação */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/complements')}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit" // Mudado de onSubmit para type="submit"
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