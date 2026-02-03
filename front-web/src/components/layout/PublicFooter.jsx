import Link from 'next/link';
import { Github, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-300">
      <div className="w-full max-w-[95%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-base text-gray-500 dark:text-gray-400">
              © {currentYear} Mayordomía Cristiana - Unión Peruana del Sur
            </span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
