import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/context/ThemeContext";
import { BRANDING } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: BRANDING.SITE_TITLE,
  description: 'Plataforma de gestión de recursos educativos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-200 transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
