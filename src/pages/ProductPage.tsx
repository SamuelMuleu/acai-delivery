import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Check } from 'lucide-react';
import { Product, useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { ComplementsList } from '../components/products/ComplementsList';
import { api, apiErrorMessage } from '../contexts/api/api';
import { formatBRL } from '../lib/orders';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, complements } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | undefined>(() => (id ? getProductById(id) : undefined));
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedComplements, setSelectedComplements] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<Product>(`/produtos/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(apiErrorMessage(err, 'Produto não encontrado.')));
  }, [id]);

  useEffect(() => {
    if (product && !selectedSize && product.tamanhos.length > 0) setSelectedSize(product.tamanhos[0].nome);
  }, [product, selectedSize]);

  const activeComplements = useMemo(
    () => complements.filter((c) => c.ativo !== false).map((c) => ({ ...c, id: Number(c.id) })),
    [complements]
  );

  // Same rule as the API: size price + selected complements
  const sizePrice = product?.tamanhos.find((t) => t.nome === selectedSize)?.preco ?? 0;
  const complementsPrice = activeComplements
    .filter((c) => selectedComplements.includes(c.id))
    .reduce((sum, c) => sum + c.preco, 0);
  const itemPrice = sizePrice + complementsPrice;

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart({
      productId: String(product.id),
      name: product.nome,
      image: product.imagem,
      size: selectedSize,
      price: itemPrice,
      complements: selectedComplements,
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleComplement = (complementId: number) => {
    setSelectedComplements((prev) =>
      prev.includes(complementId) ? prev.filter((c) => c !== complementId) : [...prev, complementId]
    );
  };

  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-700 mb-6">{error}</p>
        <button onClick={() => navigate('/')} className="bg-purple-600 text-white rounded-lg py-3 px-6 hover:bg-purple-700">
          Voltar para o cardápio
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" aria-label="Carregando" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors">
        <ChevronLeft size={20} className="mr-1" aria-hidden />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden md:flex">
        <div className="md:w-1/2">
          <img src={product.imagem} alt={product.nome} className="h-80 w-full object-cover md:h-full" />
        </div>

        <div className="p-6 sm:p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.nome}</h1>
          {product.descricao && <p className="text-gray-600 mb-6">{product.descricao}</p>}

          <fieldset className="mb-8">
            <legend className="text-lg font-semibold mb-3">Escolha o tamanho</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.tamanhos.map((t) => (
                <label
                  key={t.nome}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-purple-500 ${
                    selectedSize === t.nome ? 'border-purple-600 bg-purple-50 text-purple-800' : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tamanho"
                    value={t.nome}
                    checked={selectedSize === t.nome}
                    onChange={() => setSelectedSize(t.nome)}
                    className="sr-only"
                  />
                  <span className="block font-semibold">{t.nome}</span>
                  <span className="text-sm text-gray-600">{formatBRL(t.preco)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <ComplementsList
            complements={activeComplements}
            selectedComplements={selectedComplements}
            toggleComplement={toggleComplement}
          />

          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Total do item</p>
              <p className="text-2xl font-bold text-gray-900">{formatBRL(itemPrice)}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addedToCart || !selectedSize}
              className={`flex-1 max-w-xs rounded-lg py-3 px-6 flex items-center justify-center font-medium text-white transition-all ${
                addedToCart ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={20} className="mr-2" aria-hidden /> Adicionado!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} className="mr-2" aria-hidden /> Adicionar ao carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
