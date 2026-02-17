'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopbar from '@/components/layout/AdminTopbar';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Only run on client side
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Redirect if not authenticated
    if (!isAuthenticated() && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [mounted, router, pathname]);
  
  // If we are on the login page, render children directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Show consistent loading state during SSR and initial mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }
  
  // Check auth only after mounted
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirigiendo...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
