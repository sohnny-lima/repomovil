'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { login } from '@/lib/api';
import { setToken } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    
    // Validate with Zod
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      
      if (response.ok && response.token) {
        setToken(response.token);
        router.push('/admin');
      } else {
        setApiError('Error al iniciar sesión');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setApiError('Credenciales incorrectas');
      } else if (error.response?.status === 422) {
        setApiError('Datos inválidos');
      } else {
        setApiError('Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 border border-slate-800 transition-colors mr-3">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-950 rounded-2xl mb-4 border border-slate-800 shadow-inner">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
            <p className="text-gray-400 text-sm">Ingresa tus credenciales para acceder al panel</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{apiError}</p>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-500 group-focus-within:text-green-500'} transition-colors`} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-950 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-green-500'} rounded-xl text-gray-200 placeholder-gray-600 focus:ring-0 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-500 group-focus-within:text-green-500'} transition-colors`} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`block w-full pl-11 pr-4 py-3 bg-slate-950 border ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-green-500'} rounded-xl text-gray-200 placeholder-gray-600 focus:ring-0 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            © 2026 Admin Panel. Solo personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
}
