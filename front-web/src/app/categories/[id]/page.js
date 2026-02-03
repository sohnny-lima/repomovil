'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, ExternalLink, Copy, Check } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import Card, { CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { getCategories, getCategoryItems } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id;
  
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);
  
  const loadData = async () => {
    try {
      // Load category info from categories list
      const categories = await getCategories();
      const cat = categories.find(c => c.id === categoryId);
      setCategory(cat);
      
      // Load all items for this category
      const itemsData = await getCategoryItems(categoryId);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PublicNavbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PublicNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Categoría no encontrada</h2>
            <Link href="/categories" className="text-blue-600 hover:text-blue-700">
              Volver a categorías
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }
  
  const Icon = getIcon(category.iconKey);
  const iconColor = category.iconColor || '#3b82f6';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800">
          <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <Home size={18} />
              </Link>
              <ChevronRight size={16} />
              <Link href="/categories" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Categorías
              </Link>
              <ChevronRight size={16} />
              <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
            </div>
          </div>
        </div>
        
        {/* Category Header (Modern & Dark) */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-950 py-16 border-b border-gray-200 dark:border-gray-800">
           {/* Background Elements */}
           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Icon Box */}
              <div
                className="p-6 rounded-3xl shadow-xl flex-shrink-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800"
              >
                <Icon size={64} style={{ color: iconColor }} />
              </div>
              
              {/* Text Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
                    {category.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-4 leading-relaxed">
                  {category.description || 'Sin descripción disponible para este ministerio.'}
                </p>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {items.length} {items.length === 1 ? 'recurso disponible' : 'recursos disponibles'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Items Grid */}
        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {items.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                  <Icon size={24} className="text-gray-400" />
               </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No hay recursos en esta categoría por el momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const ItemIcon = getIcon(item.iconKey);
                const itemIconColor = item.iconColor || iconColor;
                const isVideo = item.type === 'YOUTUBE';
                
                return (
                  <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-transparent hover:border-green-200 dark:hover:border-green-500/30 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col h-full">
                      {/* Top Row: Icon & Type */}
                      <div className="flex items-start justify-between mb-4">
                         <div
                           className="p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                           style={{ backgroundColor: `${itemIconColor}15` }}
                         >
                           <ItemIcon size={28} style={{ color: itemIconColor }} />
                         </div>
                         <Badge variant={getTypeVariant(item.type)} className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                            {item.type}
                         </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 mb-6">
                          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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
                          className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-green-500 dark:hover:bg-green-500 text-gray-900 dark:text-white hover:text-white dark:hover:text-slate-950 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={18} />
                          <span>Abrir</span>
                        </button>
                        
                        <button
                          onClick={() => handleCopyLink(item.url, item.id)}
                          className="p-3 rounded-xl bg-transparent border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-green-500 hover:border-green-500 transition-colors"
                          title="Copiar enlace"
                        >
                           {copiedId === item.id ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                  </div>
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
