'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Youtube } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import HeroCarousel from '@/components/home/HeroCarousel';
import { getCategories, searchItems } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [catsData, resourcesData] = await Promise.all([
          getCategories(),
          searchItems('')
        ]);
        setCategories(catsData);
        setRecentResources(resourcesData);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <div className="w-full">
        {/* Section 0: Hero Carousel (Full Width) */}
        <section className="w-full">
          <HeroCarousel />
        </section>
      </div>
      
      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Section 1: Ministerios (Categories) - Horizontal Scroll */}
        <section className="space-y-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-2 bg-green-500 rounded-full"></div>
            <h2 className="text-gray-900 dark:text-white text-3xl font-bold tracking-wide uppercase">MINISTERIOS</h2>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="aspect-square bg-gray-200 dark:bg-slate-900 rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : categories.length === 0 ? (
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No hay ministerios disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => {
                const Icon = getIcon(cat.iconKey);
                return (
                  <Link key={cat.id} href={`/categories/${cat.id}`}>
                    <div className="group aspect-square bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 rounded-3xl p-3 sm:p-5 md:p-8 flex flex-col items-center justify-center border border-gray-100 dark:border-transparent hover:border-green-200 dark:hover:border-green-500/30 shadow-sm hover:shadow-xl dark:shadow-none relative overflow-hidden text-center h-full">
                      {/* Glow effect on hover (dark mode) */}
                      <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity dark:block hidden pointer-events-none"></div>
                      <div className="absolute top-0 right-0 p-3 sm:p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                        <ChevronRight className="text-gray-400 dark:text-green-500 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      
                      <div className="relative z-10 mb-3 sm:mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-green-900/20`} 
                             style={{ backgroundColor: cat.iconColor ? `${cat.iconColor}20` : '#22c55e20' }}>
                          <Icon size={24} className="sm:w-8 sm:h-8 md:w-10 md:h-10" style={{ color: cat.iconColor || '#22c55e' }} />
                        </div>
                      </div>
                      
                      <div className="relative z-10 w-full px-1">
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm sm:text-xl md:text-2xl mb-1 sm:mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2 leading-tight">
                          {cat.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider">
                          {cat.items?.length || 0} Recursos
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 2: Recursos Destacados - Vertical List */}
        <section className="space-y-8">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-2 bg-blue-500 rounded-full"></div>
                <h2 className="text-gray-900 dark:text-white text-3xl font-bold tracking-wide uppercase">RECURSOS DESTACADOS</h2>
              </div>
          </div>

          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-24 bg-gray-200 dark:bg-slate-900 rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : recentResources.length === 0 ? (
             <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
               <p className="text-gray-500 dark:text-gray-400 text-lg">No hay recursos destacados</p>
             </div>
          ) : (
            <div className="space-y-4">
              {recentResources.map((item) => {
                const isVideo = item.type === 'YOUTUBE';
                
                return (
                  <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-transparent hover:border-blue-200 dark:hover:border-gray-800 shadow-sm dark:shadow-none transition-all group">
                    <div className="flex items-center space-x-6">
                      {/* Icon Box */}
                      <div className="flex-shrink-0">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isVideo ? 'bg-red-50 dark:bg-red-500/10' : 'bg-blue-50 dark:bg-blue-500/10'}`}>
                            {isVideo ? (
                              <Youtube className="text-red-600 dark:text-red-500 fill-current" size={32} />
                            ) : (
                              <FileText className="text-blue-600 dark:text-blue-500" size={32} />
                            )}
                         </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center space-x-3 mb-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider ${isVideo ? 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-white'}`}>
                              {isVideo ? 'VIDEO' : 'DOCUMENTO'}
                            </span>
                            <span className="text-gray-400 dark:text-gray-600 text-xs uppercase font-bold tracking-wider">
                              {item.category?.name || 'Recurso'}
                            </span>
                         </div>
                         
                         <h3 className="text-gray-900 dark:text-white text-xl font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer" 
                             onClick={() => window.open(item.url, '_blank')}>
                           {item.title}
                         </h3>
                         
                         <div className="flex items-center text-gray-500 dark:text-gray-500 text-sm mt-1 space-x-2">
                            {item.description ? (
                              <span className="truncate max-w-[500px]">{item.description}</span>
                            ) : (
                              <span>Sin descripción</span>
                            )}
                         </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="hidden sm:block">
                         <button 
                           onClick={() => window.open(item.url, '_blank')}
                           className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                         >
                           <ChevronRight size={18} />
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      
      <PublicFooter />
    </div>
  );
}
