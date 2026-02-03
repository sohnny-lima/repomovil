'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ExternalLink, Copy, Check, FileText, Youtube } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import Badge from '@/components/ui/Badge';
import { searchItems } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <main className="flex-1">
        <Suspense fallback={
          <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </main>
      
      <PublicFooter />
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const data = await searchItems(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleCopyLink = (url, itemId) => {
    navigator.clipboard.writeText(url);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const getTypeVariant = (type) => {
    const map = {
      YOUTUBE: 'youtube',
      DRIVE: 'drive',
      ONEDRIVE: 'onedrive',
      OTHER: 'other',
    };
    return map[type] || 'default';
  };
  
  return (
    <>
        {/* Search Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 py-12">
          <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Buscar Recursos</h1>
            
            <form onSubmit={handleSearch} className="max-w-3xl">
               <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-slate-950 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm text-lg"
                        placeholder="Escribe título, descripción o tema..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                     <button 
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                     >
                        Buscar
                     </button>
                </div>
            </form>
          </div>
        </div>
        
        {/* Results */}
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-64 bg-gray-200 dark:bg-slate-900 rounded-3xl animate-pulse"></div>
               ))}
             </div>
          ) : !searched ? (
            <div className="text-center py-20">
               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-900 mb-6">
                   <Search size={32} className="text-gray-400" />
               </div>
              <p className="text-xl text-gray-500 dark:text-gray-400">Ingresa un término de búsqueda para comenzar</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                  <Search size={24} className="text-gray-400" />
               </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron resultados para &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Se encontraron <span className="font-bold text-gray-900 dark:text-white">{results.length}</span> resultados para &quot;{query}&quot;
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((item) => {
                  const Icon = getIcon(item.iconKey);
                  const iconColor = item.iconColor || '#3b82f6';
                  const isVideo = item.type === 'YOUTUBE';
                  
                  return (
                    <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col h-full">
                         {/* Top Row: Icon & Type */}
                      <div className="flex items-start justify-between mb-4">
                         <div
                           className="p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                           style={{ backgroundColor: `${iconColor}15` }}
                         >
                           <Icon size={28} style={{ color: iconColor }} />
                         </div>
                         <Badge variant={getTypeVariant(item.type)} className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                            {item.type}
                         </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 mb-6">
                           {item.category && (
                              <div className="mb-2">
                                <Link
                                  href={`/categories/${item.category.id}`}
                                  className="text-xs font-bold uppercase tracking-wider text-green-600 hover:text-green-500 transition-colors"
                                >
                                  {item.category.name}
                                </Link>
                              </div>
                            )}

                          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                             {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                            {item.description || 'Sin descripción'}
                          </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-auto">
                        <button
                          onClick={() => window.open(item.url, '_blank')}
                          className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-500 text-gray-900 dark:text-white hover:text-white dark:hover:text-slate-950 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={18} />
                          <span>Abrir</span>
                        </button>
                        
                        <button
                          onClick={() => handleCopyLink(item.url, item.id)}
                          className="p-3 rounded-xl bg-transparent border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors"
                          title="Copiar enlace"
                        >
                           {copiedId === item.id ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
    </>
  );
}
