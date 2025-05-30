import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Check } from 'lucide-react';
import { Complement, Product, useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { ComplementsList } from '../components/products/ComplementsList';
import { Tamanho } from '../contexts/OrderContext';
import { api } from '../contexts/api/api';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getComplements, loading } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product>();
  const [complements, setComplements] = useState<Complement[]>();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedComplements, setSelectedComplements] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);




  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produtos/${id}`);
        setProduct(response.data);
        if (response.data?.tamanhos?.length > 0) {
          setSelectedSize(response.data.tamanhos[0].nome);
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    };


    if (id) {
      fetchProduct();
      setComplements(getComplements());
    }
  }, [id, getComplements]);

  useEffect(() => {


    if (id) {
      const productData = getProductById(id);
      setProduct(productData);

      if (productData && productData.tamanhos.length > 0) {
        setSelectedSize(productData.tamanhos[0].nome);
      }

      setComplements(getComplements());

    }
  }, [id, getProductById, getComplements]);




  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    const size = product.tamanhos.find((t: Tamanho) => t.nome === selectedSize);

    addToCart({
      productId: product.id,
      name: product.nome,
      image: product.imagem,
      size: selectedSize,
      price: size?.preco || 0,
      complements: selectedComplements,
      quantity: 1
    });

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const toggleComplement = (complementId: string) => {
    setSelectedComplements(prev =>
      prev.includes(complementId)
        ? prev.filter(id => id !== complementId)
        : [...prev, complementId]
    );
  };

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.imagem}
              alt={product.nome}
              className="h-80 w-full object-cover md:h-full"
            />
          </div>

          <div className="p-8 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.nome}</h1>
            <p className="text-gray-600 mb-6">{product.descricao}</p>



            <ComplementsList
              complements={complements ?? []}
              selectedComplements={selectedComplements}
              toggleComplement={toggleComplement}
            />

            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`w-full rounded-lg py-3 px-6 flex items-center justify-center font-medium text-white transition-all ${addedToCart
                  ? 'bg-green-500'
                  : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} className="mr-2" />
                    Adicionado ao carrinho!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} className="mr-2" />
                    Adicionar ao carrinho
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

