import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, createProduct, updateProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    tamanhos: [{ rotulo: '', preco: 0 }]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const product = getProductById(id);
      if (product) {
        setFormData({
          nome: product.nome,
          descricao: product.descricao,
          imagem: product.imagem,
          tamanhos: [...product.tamanhos]
        });
      }
    }
  }, [id, getProductById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index: number, field: string, value: string | number) => {
    const updatedSizes = [...formData.tamanhos];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormData(prev => ({ ...prev, tamanhos: updatedSizes }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      tamanhos: [...prev.tamanhos, { rotulo: '', preco: 0 }]
    }));
  };

  const removeSize = (index: number) => {
    if (formData.tamanhos.length > 1) {
      const updatedSizes = [...formData.tamanhos];
      updatedSizes.splice(index, 1);
      setFormData(prev => ({ ...prev, tamanhos: updatedSizes }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    
    if (!formData.imagem.trim()) {
      newErrors.imagem = 'URL da imagem é obrigatória';
    }
    
    formData.tamanhos.forEach((tamanho, index) => {
      if (!tamanho.rotulo.trim()) {
        newErrors[`tamanho_rotulo_${index}`] = 'Rótulo é obrigatório';
      }
      
      if (tamanho.preco <= 0) {
        newErrors[`tamanho_preco_${index}`] = 'Preço deve ser maior que zero';
      }
    });
    
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
        updateProduct(id, formData);
      } else {
        createProduct(formData);
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => navigate('/admin/products')}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar para lista de produtos
      </button>
      
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Editar Produto' : 'Novo Produto'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
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
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.descricao ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.descricao && <p className="mt-1 text-sm text-red-500">{errors.descricao}</p>}
            </div>
            
            <div>
              <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                id="imagem"
                name="imagem"
                value={formData.imagem}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.imagem ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.imagem && <p className="mt-1 text-sm text-red-500">{errors.imagem}</p>}
              
              {formData.imagem && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={formData.imagem} 
                    alt="Preview" 
                    className="h-32 w-auto object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagem+Inválida';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tamanhos e Preços
                </label>
                <button
                  type="button"
                  onClick={addSize}
                  className="flex items-center text-purple-600 text-sm hover:text-purple-800"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar Tamanho
                </button>
              </div>
              
              {formData.tamanhos.map((tamanho, index) => (
                <div key={index} className="flex gap-3 mb-3 items-start">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Rótulo (ex: 300ml)
                    </label>
                    <input
                      type="text"
                      value={tamanho.rotulo}
                      onChange={(e) => handleSizeChange(index, 'rotulo', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors[`tamanho_rotulo_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`tamanho_rotulo_${index}`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`tamanho_rotulo_${index}`]}</p>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={tamanho.preco}
                      onChange={(e) => handleSizeChange(index, 'preco', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors[`tamanho_preco_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`tamanho_preco_${index}`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`tamanho_preco_${index}`]}</p>
                    )}
                  </div>
                  
                  {formData.tamanhos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;