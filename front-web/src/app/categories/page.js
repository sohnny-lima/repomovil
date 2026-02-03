'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import Input from '@/components/ui/Input';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { getCategories } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);
  
  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 py-12">
          <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              {/* Title & Subtitle */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Todas las Categorías
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Explora nuestra colección completa de recursos organizados por ministerios y áreas de interés.
                </p>
              </div>

               {/* Search Bar */}
              <div className="w-full md:w-auto flex-1 md:max-w-2xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-32 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all shadow-sm text-lg"
                        placeholder="Buscar categorías..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                     <button 
                        type="button" // Type button to avoid form submission if wrapped
                        className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                     >
                        Buscar
                     </button>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Categories Grid */}
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                 <div key={i} className="aspect-square bg-gray-200 dark:bg-slate-900 rounded-3xl animate-pulse"></div>
               ))}
             </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                  <Search size={24} className="text-gray-400" />
               </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron categorías que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredCategories.map((category) => {
                const Icon = getIcon(category.iconKey);
                
                return (
                  <Link key={category.id} href={`/categories/${category.id}`}>
                    <div className="group aspect-square bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-transparent hover:border-green-200 dark:hover:border-green-500/30 shadow-sm hover:shadow-xl dark:shadow-none relative overflow-hidden text-center h-full">
                      {/* Glow effect on hover (dark mode) */}
                      <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity dark:block hidden pointer-events-none"></div>
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                        <ChevronRight className="text-gray-400 dark:text-green-500 w-5 h-5" />
                      </div>
                      
                      <div className="relative z-10 mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-green-900/20`} 
                             style={{ backgroundColor: category.iconColor ? `${category.iconColor}20` : '#22c55e20' }}>
                          <Icon size={32} className="md:w-10 md:h-10" style={{ color: category.iconColor || '#22c55e' }} />
                        </div>
                      </div>
                      
                      <div className="relative z-10 w-full">
                        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
                          {category.items?.length || 0} Recursos
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <PublicFooter />
    </div>
  );
}
