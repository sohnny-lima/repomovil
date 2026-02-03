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
  
  useEffect(() => {
    // Redirect if not authenticated
    // Skip redirect if we are already on login page to avoid loops
    if (!isAuthenticated() && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [router, pathname]);
  
  // If we are on the login page, render children directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Check auth on client side only
  if (typeof window === 'undefined' || !isAuthenticated()) {
    return null;
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
