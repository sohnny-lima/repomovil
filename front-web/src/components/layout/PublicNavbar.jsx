'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@/context/ThemeContext';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/categories', label: 'Ministerios' },
    { href: '/search', label: 'Recursos' },
  ];

  return (
    <nav className="bg-slate-950 border-b border-gray-800">
      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full overflow-hidden bg-white">
              <Image 
                src="/logo/logo.png" 
                alt="Logo" 
                fill
                className="object-contain p-2"
                sizes="80px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white leading-none">Mayordomía 2026</span>
              <span className="text-sm text-green-500 font-medium tracking-wide">UNIÓN PERUANA DEL SUR</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-lg font-medium transition-colors hover:text-green-400',
                  pathname === link.href ? 'text-white' : 'text-gray-400'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-white dark:hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <Link href="/admin/login" className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold py-2.5 px-8 text-lg rounded-full transition-colors">
              Ingresar
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  pathname === link.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Link
                href="/admin/login"
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-slate-950 font-bold py-2 px-6 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
