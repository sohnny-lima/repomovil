'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Music, Video, File, Download, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import CategoryCard from '@/components/ui/CategoryCard';
import { getMinistryBySlug } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000';

function resolveUrl(url) {
  if (!url) return '#';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

const TYPE_CONFIG = {
  PDF:   { label: 'PDF',   bgClass: 'bg-red-100 dark:bg-red-500/20',      textClass: 'text-red-700 dark:text-red-400',       iconClass: 'text-red-600 dark:text-red-400',       Icon: FileText },
  PPTX:  { label: 'PPTX',  bgClass: 'bg-orange-100 dark:bg-orange-500/20', textClass: 'text-orange-700 dark:text-orange-400',  iconClass: 'text-orange-600 dark:text-orange-400',  Icon: FileText },
  WORD:  { label: 'Word',  bgClass: 'bg-indigo-100 dark:bg-indigo-500/20', textClass: 'text-indigo-700 dark:text-indigo-400',  iconClass: 'text-indigo-600 dark:text-indigo-400',  Icon: File },
  AUDIO: { label: 'Audio', bgClass: 'bg-green-100 dark:bg-green-500/20',  textClass: 'text-green-700 dark:text-green-400',    iconClass: 'text-green-600 dark:text-green-400',    Icon: Music },
  VIDEO: { label: 'Video', bgClass: 'bg-blue-100 dark:bg-blue-500/20',    textClass: 'text-blue-700 dark:text-blue-400',      iconClass: 'text-blue-600 dark:text-blue-400',      Icon: Video },
};

function ResourceCard({ resource }) {
  const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.PDF;
  const Icon = cfg.Icon;
  const fileUrl = resolveUrl(resource.fileUrl);
  const isMedia  = resource.type === 'AUDIO' || resource.type === 'VIDEO';
  const isPdf    = resource.type === 'PDF';
  const size     = resource.sizeBytes ?? resource.size;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bgClass}`}>
          <Icon size={24} className={cfg.iconClass} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${cfg.bgClass} ${cfg.textClass}`}>
              {cfg.label}
            </span>
            {size && (
              <span className="text-xs text-gray-400 dark:text-gray-600">
                {(Number(size) / (1024 * 1024)).toFixed(1)} MB
              </span>
            )}
          </div>
          <h3 className="text-gray-900 dark:text-white font-bold text-base mb-0.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{resource.description}</p>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          {/* Open button — for PDF and inline-playable media (not WORD, PPTX) */}
          {(isPdf || isMedia) && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              title="Abrir"
            >
              <ExternalLink size={18} />
            </a>
          )}
          {/* Download button — always shown */}
          <a
            href={fileUrl}
            download={resource.originalName || resource.title}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title="Descargar"
          >
            <Download size={18} />
          </a>
        </div>
      </div>

      {/* Inline player for audio/video */}
      {resource.type === 'AUDIO' && (
        <div className="mt-3">
          <audio controls className="w-full h-10 rounded-lg" src={fileUrl}>
            Tu navegador no soporta audio.
          </audio>
        </div>
      )}
      {resource.type === 'VIDEO' && (
        <div className="mt-3">
          <video controls className="w-full rounded-xl max-h-64 bg-black" src={fileUrl}>
            Tu navegador no soporta video.
          </video>
        </div>
      )}
    </div>
  );
}

export default function MinistryPage() {
  const { slug } = useParams();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [filter, setFilter]     = useState('ALL');

  useEffect(() => {
    if (!slug) return;
    getMinistryBySlug(slug)
      .then(setMinistry)
      .catch((err) => {
        console.error("Error cargando ministerio:", err);
        if (err.response?.status === 404) {
          setMinistry(null);
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const types = ['ALL', 'PDF', 'PPTX', 'WORD', 'AUDIO', 'VIDEO'];
  const resources = ministry?.resources?.filter(r => filter === 'ALL' || r.type === filter) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />

      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-green-500" />
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 max-w-2xl mx-auto">
            <p className="text-red-500 dark:text-red-400 text-xl font-bold">Error cargando datos</p>
            <p className="text-red-400 dark:text-red-500 mt-2">Por favor intenta de nuevo más tarde.</p>
          </div>
        ) : !ministry ? (
          <div className="text-center py-24">
            <p className="text-gray-500 dark:text-gray-400 text-xl">Ministerio no encontrado</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-1.5 bg-green-500 rounded-full" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{ministry.name}</h1>
                {ministry.description && (
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{ministry.description}</p>
                )}
              </div>
            </div>

            {/* Ministry Resources Section (Only if elements exist) */}
            {ministry.resources && ministry.resources.length > 0 && (
              <>
                {/* Type filters */}
                <div className="flex flex-wrap gap-2 mb-6 max-w-2xl mx-auto">
                  {types.map(t => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        filter === t
                          ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                          : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-700'
                      }`}
                    >
                      {t === 'ALL' ? 'Todos' : t}
                    </button>
                  ))}
                </div>

                {/* Resources */}
                {resources.length === 0 ? (
                  <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 max-w-2xl mx-auto">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      {filter === 'ALL' ? 'No hay recursos disponibles aún' : `No hay recursos de tipo ${filter}`}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto space-y-4">
                    {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Dynamic Categories Render Block */}
        {ministry?.categories && ministry.categories.length > 0 && (
          <div className="mt-8">
            <div className="max-w-2xl mx-auto space-y-4">
              {ministry.categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
