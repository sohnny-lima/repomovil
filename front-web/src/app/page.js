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
              {categories.map((cat) => {
                const Icon = getIcon(cat.iconKey);
                return (
                  <Link key={cat.id} href={`/categories/${cat.id}`}>
                    <div className="mb-6 group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:from-green-50 hover:to-white dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-500 rounded-3xl p-6 flex items-center gap-5 border border-gray-200/60 dark:border-gray-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:shadow-green-200/30 dark:hover:shadow-green-900/20 cursor-pointer overflow-hidden backdrop-blur-sm hover:-translate-y-1">
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      {/* Icon or Image */}
                      <div className="relative flex-shrink-0 z-10">
                        {cat.imageUrl ? (
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-gray-300/40 dark:shadow-black/40 group-hover:shadow-xl group-hover:shadow-green-500/30 dark:group-hover:shadow-green-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-300/40 dark:shadow-black/40 group-hover:shadow-xl group-hover:shadow-green-500/30 dark:group-hover:shadow-green-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 backdrop-blur-sm" 
                            style={{ 
                              background: cat.iconColor 
                                ? `linear-gradient(135deg, ${cat.iconColor}15, ${cat.iconColor}30)` 
                                : 'linear-gradient(135deg, #22c55e15, #22c55e30)'
                            }}
                          >
                            <Icon size={32} style={{ color: cat.iconColor || '#22c55e' }} className="group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="relative flex-1 min-w-0 z-10">
                        <h3 className="text-gray-900 dark:text-white font-bold text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 truncate mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 group-hover:animate-pulse"></span>
                          {cat.items?.length || 0} Recursos disponibles
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
