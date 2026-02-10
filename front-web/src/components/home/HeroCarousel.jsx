'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getHeroSlides } from '@/lib/api';
import { BRANDING } from '@/lib/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const getImageUrl = (url) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/imagenes/')) return url; // Start with local path
  // Ensure it starts with / for backend path
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    imageUrl: '/imagenes/imagen 1.webp',
    title: BRANDING.HERO_WELCOME,
    subtitle: BRANDING.ORGANIZATION_NAME,
    linkUrl: '#'
  },
  {
    id: 'default-2',
    imageUrl: '/imagenes/imagen 2.webp',
    title: 'Recursos para el Crecimiento',
    subtitle: 'Fortaleciendo la fe y el compromiso',
    linkUrl: '#'
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const data = await getHeroSlides();
        if (data && data.length > 0) {
          setSlides(data);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] bg-gray-200 dark:bg-slate-900 animate-pulse min-h-[400px] md:min-h-[500px]" />
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:aspect-[21/9] overflow-hidden group shadow-xl bg-slate-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
                src={getImageUrl(slide.imageUrl)}
                alt={slide.title || 'Slide Image'}
                fill
                className={`object-cover object-center transition-transform duration-[10000ms] ease-linear transform ${
                    index === currentIndex ? 'scale-105' : 'scale-100'
                }`}
                priority={index === 0} // Load first image immediately
                sizes="100vw"
                unoptimized // Bypass server-side optimization to avoid "private ip" errors on localhost
                style={{ objectPosition: 'center' }} // Force center alignment for mobile cropping
            />
          </div>
          
          {/* Overlay Gradient - Darker on mobile for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent md:from-slate-950/90 md:to-transparent z-10" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 pb-16 md:pb-12 z-20">
            <div className={`w-full flex flex-row items-end justify-between gap-3 md:gap-6 transition-all duration-700 delay-100 transform ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                
                {/* Left Side: Text */}
                <div className="flex-1 max-w-4xl flex flex-col items-start gap-3 min-w-0">
                    {/* Title Box - Modern Glass Tag */}
                    <div className="bg-slate-950/40 backdrop-blur-xl rounded-xl px-4 py-2 md:px-6 md:py-3 border border-white/10 shadow-2xl inline-block max-w-full">
                        <h2 className="text-lg md:text-xl font-bold text-white m-0 uppercase tracking-widest truncate">
                            {slide.title}
                        </h2>
                    </div>
                    
                    {/* Subtitle - Editorial Style with Accent */}
                    {slide.subtitle && (
                        <p className="text-lg md:text-xl font-medium text-gray-200 mt-1 md:mt-2 pl-4 border-l-4 border-green-500 drop-shadow-md uppercase tracking-wide truncate max-w-full">
                            {slide.subtitle}
                        </p>
                    )}
                </div>
                
                {/* Right Side: Button */}
                {slide.linkUrl && (
                <div className="flex-shrink-0 pl-2">
                    <a 
                        href={slide.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 md:gap-2 bg-green-500 hover:bg-green-600 text-slate-950 font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-green-500/20 text-xs sm:text-sm md:text-base"
                    >
                        Ver Más <ExternalLink size={14} className="md:w-4 md:h-4" />
                    </a>
                </div>
                )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on very small screens, visible on sm+ */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110 z-30 hidden sm:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110 z-30 hidden sm:flex"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 flex space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-green-500 w-6 md:w-8' 
                    : 'bg-white/30 hover:bg-white/50 w-2 md:w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
