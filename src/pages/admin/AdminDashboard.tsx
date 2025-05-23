import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import OrdersList from '../../components/admin/OrdersList';
import ProductsList from '../../components/admin/ProductsList';
import ProductForm from '../../components/admin/ProductForm';
import ComplementsList from '../../components/admin/ComplementsList';
import ComplementForm from '../../components/admin/ComplementForm';
import OrderDetails from '../../components/admin/OrderDetails';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const NavItem: React.FC<{ 
    icon: React.ReactNode; 
    text: string; 
    path: string;
    onClick?: () => void;
  }> = ({ icon, text, path, onClick }) => (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          navigate(path);
          setIsMobileMenuOpen(false);
        }
      }}
      className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors w-full ${
        isActive(path)
          ? 'bg-purple-100 text-purple-700'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md py-4 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">Dashboard Admin</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md animate-fadeIn">
          <div className="py-3 px-4 space-y-1">
            <NavItem 
              icon={<ShoppingBag size={20} />} 
              text="Pedidos" 
              path="/admin" 
            />
            <NavItem 
              icon={<Package size={20} />} 
              text="Produtos" 
              path="/admin/products" 
            />
            <NavItem 
              icon={<Package size={20} />} 
              text="Complementos" 
              path="/admin/complements" 
            />
            <NavItem 
              icon={<Users size={20} />} 
              text="Usuários" 
              path="/admin/users" 
            />
            <NavItem 
              icon={<LogOut size={20} />} 
              text="Sair" 
              path="/admin" 
              onClick={logout}
            />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-5 border-b">
            <div className="flex items-center space-x-2">
              <LayoutDashboard size={24} className="text-purple-600" />
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
          </div>
          
          <nav className="flex-1 p-5 space-y-2">
            <NavItem 
              icon={<ShoppingBag size={20} />} 
              text="Pedidos" 
              path="/admin" 
            />
            <NavItem 
              icon={<Package size={20} />} 
              text="Produtos" 
              path="/admin/products" 
            />
            <NavItem 
              icon={<Package size={20} />} 
              text="Complementos" 
              path="/admin/complements" 
            />
            <NavItem 
              icon={<Users size={20} />} 
              text="Usuários" 
              path="/admin/users" 
            />
          </nav>
          
          <div className="p-5 border-t">
            <button
              onClick={logout}
              className="flex items-center space-x-3 text-red-600 hover:text-red-800 transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<OrdersList />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/complements" element={<ComplementsList />} />
            <Route path="/complements/new" element={<ComplementForm />} />
            <Route path="/complements/edit/:id" element={<ComplementForm />} />
            <Route path="/users" element={<div>Users Management</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;