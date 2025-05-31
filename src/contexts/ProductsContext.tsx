import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from "./api/api"

export type ComplementInput = {
  nome: string;
  tipo: 'fruta' | 'cobertura' | 'adicional';
  preco: number;
  ativo?: boolean;
};


export interface Product {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  tamanhos: {
    nome: string;
    preco: number;
  }[];
}

export interface Complement {
  id: string;
  nome: string;
  tipo: 'fruta' | 'cobertura' | 'adicional';
  preco: number;
  ativo?: boolean;
}


export interface InitialProducts {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  tamanhos: {
    nome: string;
    preco: number;
  }[];
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  complements: Complement[];
  getProductById: (id: string) => Product | undefined;
  createProduct: (data: FormData) => Promise<Product>;
  updateProduct: (id: string, data: FormData) => Promise<Product>;
  deleteProduct: (id: string) => void;
  fetchProducts: () => Promise<void>;
  getComplements: () => Complement[] | undefined;
  getComplementById: (id: string) => Complement | undefined;
  createComplement: (complement: ComplementInput) => Promise<Complement>;
  updateComplement: (id: string, complement: Partial<Complement>) => void;
  deleteComplement: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<InitialProducts[]>([]);

  const [complements, setComplements] = useState<Complement[]>([]);


  const [loading, setLoading] = useState(false);



  const fetchComplements = async () => {
    try {
      const res = await api.get('/complementos');
      setComplements(res.data);
    } catch (error) {
      console.error('Erro ao buscar complementos:', error);
    }
  };




  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);



  const fetchProducts = async () => {
    try {
      const response = await api.get('/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar Produtos:', error);
    }
  }

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };
  const createProduct = async (data: FormData): Promise<Product> => {
    const response = await api.post('/produtos', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };



  const updateProduct = async (id: string, formData: FormData): Promise<Product> => {
    try {
      const response = await api.put(`/produtos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  };
  const deleteProduct = (id: string) => {
    api.delete(`/produtos/${id}`)
      .then(() => {

      })
      .catch((error) => {
        console.error('Erro ao deletar produto:', error);
      });

    setProducts(prev => prev.filter(product => product.id !== id));


  };

  const getComplements = () => {
    return complements;
  };

  const getComplementById = (id: string) => {
    return complements.find(complement => complement.id === id);
  };

  const createComplement = async (complement: ComplementInput) => {
    const response = await api.post('/complementos', [complement]);
    const savedComplement = response.data[0];
    setComplements(prev => [...prev, savedComplement]);
    return savedComplement;
  };

  const updateComplement = (id: string, updatedComplement: Partial<Complement>) => {
    setComplements(prev =>
      prev.map(complement =>
        complement.id === id ? { ...complement, ...updatedComplement } : complement
      )
    );
  };

  const deleteComplement = async (id: string) => {
    try {
      await api.delete(`/complementos/${id}`);
      setComplements(prev => prev?.filter(complement => complement.id !== id));
    } catch (err) {
      console.error('Erro ao deletar complemento:', err);
    }
  };
  useEffect(() => {
    fetchComplements();
    fetchProducts();
  }, []);


  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      complements,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      getComplements,
      getComplementById,
      createComplement,
      updateComplement,
      deleteComplement,
      fetchProducts,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};