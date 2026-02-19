import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getIcon } from '@/lib/iconMap';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/imagenes/')) return url; // Local assets
  // Ensure it starts with / for backend path
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export default function CategoryCard({ category }) {
  const Icon = getIcon(category.iconKey);
  const imageUrl = getImageUrl(category.imageUrl);

  return (
    <Link href={`/categories/${category.id}`}>
      <div className="mb-6 group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:from-green-50 hover:to-white dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-500 rounded-3xl p-4 md:p-6 flex items-center gap-4 md:gap-5 border border-gray-200/60 dark:border-gray-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:shadow-green-200/30 dark:hover:shadow-green-900/20 cursor-pointer overflow-hidden backdrop-blur-sm hover:-translate-y-1">
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Helper Wrapper for Image/Icon - Responsive Size */}
        <div className="relative flex-shrink-0 z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg shadow-gray-300/40 dark:shadow-black/40 group-hover:shadow-xl group-hover:shadow-green-500/30 dark:group-hover:shadow-green-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gray-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10">
          {imageUrl ? (
             <Image
                src={imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 56px, 64px"
                className="object-cover"
                unoptimized // Avoids local IP issues during dev
             />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center backdrop-blur-sm" 
              style={{ 
                background: category.iconColor 
                  ? `linear-gradient(135deg, ${category.iconColor}15, ${category.iconColor}30)` 
                  : 'linear-gradient(135deg, #22c55e15, #22c55e30)'
              }}
            >
              {/* Render icon using createElement to avoid lint issues with dynamic components */}
              {React.createElement(Icon, {
                size: 28,
                style: { color: category.iconColor || '#22c55e' },
                className: "group-hover:scale-110 transition-transform duration-300 md:w-8 md:h-8"
              })}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="relative flex-1 min-w-0 z-10">
          <h3 className="text-gray-900 dark:text-white font-bold text-lg md:text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 truncate mb-0.5 md:mb-1 line-clamp-1">
            {category.name}
          </h3>
          <p className="text-gray-500 dark:text-white/60 text-xs md:text-sm font-semibold flex items-center gap-2 line-clamp-1">
            <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 group-hover:animate-pulse shrink-0"></span>
            <span className="truncate">{category.items?.length || 0} Recursos disponibles</span>
          </p>
        </div>
        
        {/* Arrow with background */}
        <div className="relative flex-shrink-0 z-10 hidden xs:block">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-slate-800 group-hover:bg-green-500 dark:group-hover:bg-green-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <ChevronRight 
              className="text-gray-400 dark:text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 w-4 h-4 md:w-5 md:h-5" 
            />
          </div>
        </div>
        
      </div>
    </Link>
  );
}
