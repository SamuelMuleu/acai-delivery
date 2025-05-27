import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import logo from "../../assets/logo.png"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300  ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
    >

      <div className="container mx-auto px-4 py-4 ">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo da marca" className="w-20 h-20  mt-4 object-contain" />

          </Link>


          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/#products" className="text-gray-800 hover:text-purple-600 transition-colors">
              Produtos
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-gray-800 hover:text-purple-600 transition-colors">
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="text-gray-800 hover:text-purple-600 transition-colors"
              >
                Sair
              </button>
            ) : (
              <Link to="/admin/login" className="text-gray-800 hover:text-purple-600 transition-colors">
                Login
              </Link>
            )}
            <Link
              to="/checkout"
              className="relative flex items-center text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full transition-colors"
            >
              <ShoppingBag size={18} className="mr-2" />
              <span>Carrinho</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>


          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden ">
            <Link
              to="/checkout"
              className="relative flex items-center"
            >
              <ShoppingBag size={24} className="text-purple-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-purple-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fadeIn ">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-800 py-2 border-b border-gray-100">
                Home
              </Link>
              <Link to="/#products" className="text-gray-800 py-2 border-b border-gray-100">
                Produtos
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-gray-800 py-2 border-b border-gray-100">
                  Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={logout}
                  className="text-left text-gray-800 py-2 border-b border-gray-100"
                >
                  Sair
                </button>
              ) : (
                <Link to="/admin/login" className="text-gray-800 py-2 border-b border-gray-100">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

