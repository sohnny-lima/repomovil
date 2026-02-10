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
        
        {/* Categories List - Linktree Style */}
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="h-20 bg-gray-200 dark:bg-slate-900 rounded-2xl animate-pulse"></div>
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
            <div className="space-y-6">
              {filteredCategories.map((category) => {
                const Icon = getIcon(category.iconKey);
                
                return (
                  <Link key={category.id} href={`/categories/${category.id}`}>
                    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:from-green-50 hover:to-white dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-500 rounded-3xl p-6 flex items-center gap-5 border border-gray-200/60 dark:border-gray-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:shadow-green-200/30 dark:hover:shadow-green-900/20 cursor-pointer overflow-hidden backdrop-blur-sm hover:-translate-y-1">
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      {/* Icon */}
                      <div className="relative flex-shrink-0 z-10">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-300/40 dark:shadow-black/40 group-hover:shadow-xl group-hover:shadow-green-500/30 dark:group-hover:shadow-green-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 backdrop-blur-sm" 
                          style={{ 
                            background: category.iconColor 
                              ? `linear-gradient(135deg, ${category.iconColor}15, ${category.iconColor}30)` 
                              : 'linear-gradient(135deg, #22c55e15, #22c55e30)'
                          }}
                        >
                          <Icon size={32} style={{ color: category.iconColor || '#22c55e' }} className="group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative flex-1 min-w-0 z-10">
                        <h3 className="text-gray-900 dark:text-white font-bold text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 truncate mb-1">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 group-hover:animate-pulse"></span>
                          {category.items?.length || 0} Recursos disponibles
                        </p>
                      </div>
                      
                      {/* Arrow with background */}
                      <div className="relative flex-shrink-0 z-10">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 group-hover:bg-green-500 dark:group-hover:bg-green-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <ChevronRight 
                            className="text-gray-400 dark:text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" 
                            size={20} 
                          />
                        </div>
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
