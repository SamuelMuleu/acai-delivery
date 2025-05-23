import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Sample data for products
const initialProducts = [
  {
    id: '1',
    nome: '200ml',
    descricao: '',
    imagem: 'https://media.istockphoto.com/id/1451849749/pt/foto/acai-bowl-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=RaAFhasFsGgcwhw4K5wQftl-9go4hlye9D2XNh1Rz5E=',
    tamanhos: [
      { rotulo: '300ml', preco: 12.90 },
      { rotulo: '500ml', preco: 16.90 },
      { rotulo: '700ml', preco: 22.90 }
    ]
  },
  {
    id: '2',
    nome: '300ml',
    descricao: '',
    imagem: 'https://media.istockphoto.com/id/1451849749/pt/foto/acai-bowl-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=RaAFhasFsGgcwhw4K5wQftl-9go4hlye9D2XNh1Rz5E=',
    tamanhos: [
      { rotulo: '300ml', preco: 14.90 },
      { rotulo: '500ml', preco: 18.90 },
      { rotulo: '700ml', preco: 24.90 }
    ]
  },
  {
    id: '3',
    nome: '400ml',
    descricao: '',
    imagem: 'https://media.istockphoto.com/id/1451849749/pt/foto/acai-bowl-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=RaAFhasFsGgcwhw4K5wQftl-9go4hlye9D2XNh1Rz5E=',
    tamanhos: [
      { rotulo: '300ml', preco: 15.90 },
      { rotulo: '500ml', preco: 19.90 },
      { rotulo: '700ml', preco: 25.90 }
    ]
  },
  {
    id: '4',
    nome: '500ml',
    descricao: '',
    imagem: 'https://media.istockphoto.com/id/1451849749/pt/foto/acai-bowl-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=RaAFhasFsGgcwhw4K5wQftl-9go4hlye9D2XNh1Rz5E=',
    tamanhos: [
      { rotulo: '300ml', preco: 15.90 },
      { rotulo: '500ml', preco: 19.90 },
      { rotulo: '700ml', preco: 25.90 }
    ]
  },
  {
    id: '5',
    nome: '700ml',
    descricao: '',
    imagem: 'https://media.istockphoto.com/id/1451849749/pt/foto/acai-bowl-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=RaAFhasFsGgcwhw4K5wQftl-9go4hlye9D2XNh1Rz5E=',
    tamanhos: [
      { rotulo: '300ml', preco: 15.90 },
      { rotulo: '500ml', preco: 19.90 },
      { rotulo: '700ml', preco: 25.90 }
    ]
  },
  {
    id: '6',
    nome: '1 Litro',
    descricao: '',
    imagem: 'https://media.istockphoto.com/id/1451849887/pt/foto/acai-bowl-with-banana-granola-and-condensed-milk-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=9pu6qgE2vst7niHxKwHPu_vntShgRV2f5TXEHV5ABKo=',
    tamanhos: [
      { rotulo: '300ml', preco: 15.90 },
      { rotulo: '500ml', preco: 19.90 },
      { rotulo: '700ml', preco: 25.90 }
    ]
  }
];

// Sample data for complements
export const initialComplements = [
  { id: '1', nome: 'Morango', tipo: 'Fruta' },
  { id: '2', nome: 'Banana', tipo: 'Fruta' },
  { id: '3', nome: 'Kiwi', tipo: 'Fruta' },
  { id: '4', nome: 'Leite Condensado', tipo: 'Cobertura' },
  { id: '5', nome: 'Chocolate', tipo: 'Cobertura' },
  { id: '6', nome: 'Mel', tipo: 'Cobertura' },
  { id: '7', nome: 'Granola', tipo: 'Adicional' },
  { id: '8', nome: 'Paçoca', tipo: 'Adicional' },
  { id: '9', nome: 'Amendoim', tipo: 'Adicional' }
];

interface ProductsContextType {
  products: any[];
  loading: boolean;
  getProductById: (id: string) => any;
  createProduct: (product: any) => void;
  updateProduct: (id: string, product: any) => void;
  deleteProduct: (id: string) => void;
  getComplements: () => any[];
  getComplementById: (id: string) => any;
  createComplement: (complement: any) => void;
  updateComplement: (id: string, complement: any) => void;
  deleteComplement: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [complements, setComplements] = useState<any[]>(initialComplements);
  const [loading, setLoading] = useState(false);

  // Simulate loading for demo purposes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const createProduct = (product: any) => {
    const newProduct = {
      ...product,
      id: uuidv4()
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updatedProduct: any) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...updatedProduct, id } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getComplements = () => {
    return complements;
  };

  const getComplementById = (id: string) => {
    return complements.find(complement => complement.id === id);
  };

  const createComplement = (complement: any) => {
    const newComplement = {
      ...complement,
      id: uuidv4()
    };
    setComplements(prev => [...prev, newComplement]);
    return newComplement;
  };

  const updateComplement = (id: string, updatedComplement: any) => {
    setComplements(prev =>
      prev.map(complement =>
        complement.id === id ? { ...updatedComplement, id } : complement
      )
    );
  };

  const deleteComplement = (id: string) => {
    setComplements(prev => prev.filter(complement => complement.id !== id));
  };

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      getComplements,
      getComplementById,
      createComplement,
      updateComplement,
      deleteComplement
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