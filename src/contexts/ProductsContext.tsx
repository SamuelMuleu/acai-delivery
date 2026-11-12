import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, apiErrorMessage } from "./api/api";

export type ComplementInput = {
  nome: string;
  tipo: "fruta" | "cobertura" | "adicional";
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
  tipo: "fruta" | "cobertura" | "adicional";
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
  error: string | null;
  complements: Complement[];
  getProductById: (id: string) => Product | undefined;
  createProduct: (data: FormData) => Promise<Product>;
  updateProduct: (id: string, data: FormData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;

  getComplements: () => Complement[] | undefined;
  getComplementById: (id: string) => Complement | undefined;
  createComplement: (complement: ComplementInput) => Promise<Complement>;
  updateComplement: (id: string, complement: Partial<Complement>) => Promise<void>;
  deleteComplement: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<InitialProducts[]>([]);

  const [complements, setComplements] = useState<Complement[]>([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplements = async () => {
    try {
      const res = await api.get("/complementos");
      setComplements(res.data);
    } catch (error) {
      console.error("Erro ao buscar complementos:", error);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/produtos");
      setProducts(response.data);
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível carregar o cardápio."));
    } finally {
      setLoading(false);
    }
  }, []);

  // API ids are numbers while route params are strings
  const getProductById = (id: string) => {
    return products.find((product) => String(product.id) === String(id));
  };
  const createProduct = async (data: FormData): Promise<Product> => {
    const response = await api.post("/produtos", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  const updateProduct = async (
    id: string,
    formData: FormData
  ): Promise<Product> => {
    try {
      const response = await api.put(`/produtos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };
  // Removes from the list only after the API confirms (products already ordered can't be deleted)
  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      setProducts((prev) => prev.filter((product) => String(product.id) !== String(id)));
    } catch (err) {
      window.alert(apiErrorMessage(err, "Não foi possível remover o produto."));
    }
  };



  const getComplements = () => {
    return complements;
  };

  const getComplementById = (id: string) => {
    return complements.find((complement) => String(complement.id) === String(id));
  };

  const createComplement = async (complement: ComplementInput) => {
    const response = await api.post("/complementos", [complement]);
    const savedComplement = response.data[0];
    setComplements((prev) => [...prev, savedComplement]);
    return savedComplement;
  };

  // Before, edits only changed local state and were lost on reload
  const updateComplement = async (id: string, updatedComplement: Partial<Complement>) => {
    const { nome, tipo, preco, ativo } = updatedComplement;
    const { data } = await api.patch(`/complementos/${id}`, { nome, tipo, preco, ativo });
    setComplements((prev) => prev.map((c) => (String(c.id) === String(id) ? data : c)));
  };

  const deleteComplement = async (id: string) => {
    try {
      const response = await api.delete(`/complementos/${id}`);
      // A complement used in past orders is deactivated instead of deleted
      if (response.status === 200 && response.data?.ativo === false) {
        setComplements((prev) => prev.map((c) => (String(c.id) === String(id) ? { ...c, ativo: false } : c)));
        window.alert("Este complemento já foi usado em pedidos, então foi desativado em vez de removido.");
      } else {
        setComplements((prev) => prev.filter((c) => String(c.id) !== String(id)));
      }
    } catch (err) {
      window.alert(apiErrorMessage(err, "Não foi possível remover o complemento."));
    }
  };

  useEffect(() => {
    fetchComplements();
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
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

      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
