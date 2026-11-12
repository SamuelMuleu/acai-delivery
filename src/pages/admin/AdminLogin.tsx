import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiErrorMessage } from '../../contexts/api/api';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Informe a senha.');
      return;
    }
    setLoading(true);
    try {
      await login(password);
      navigate('/admin');
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível entrar. Tente novamente.'));
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-purple-600 py-6 px-8 text-white text-center">
          <h1 className="text-2xl font-bold">Área Administrativa</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div role="alert" className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha do administrador
          </label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-purple-600 text-white rounded-lg py-3 px-6 font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
