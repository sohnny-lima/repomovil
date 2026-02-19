'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Youtube } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import HeroCarousel from '@/components/home/HeroCarousel';
import { getCategories, searchItems } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';
import CategoryCard from '@/components/ui/CategoryCard';

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
        
        {/* Section 1: Ministerios (Categories) - Linktree Style */}
        <section>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-2 bg-green-500 rounded-full"></div>
            <h2 className="text-gray-900 dark:text-white text-3xl font-bold tracking-wide uppercase">MINISTERIOS</h2>
          </div>

          {loading ? (
             <div className="space-y-16 max-w-2xl mx-auto">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-20 bg-gray-200 dark:bg-slate-900 rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : categories.length === 0 ? (
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No hay ministerios disponibles</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
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
             <div className="space-y-4 max-w-2xl mx-auto">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-24 bg-gray-200 dark:bg-slate-900 rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : recentResources.length === 0 ? (
             <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center max-w-2xl mx-auto">
               <p className="text-gray-500 dark:text-gray-400 text-lg">No hay recursos destacados</p>
             </div>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
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
