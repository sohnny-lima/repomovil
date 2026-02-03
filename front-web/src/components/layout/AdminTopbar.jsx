'use client';

import { Menu } from 'lucide-react';

export default function AdminTopbar({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
        </div>
      </div>
    </header>
  );
}
