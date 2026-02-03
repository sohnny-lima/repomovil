'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, FileText, TrendingUp, Plus } from 'lucide-react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getCategories } from '@/lib/api';

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Categorías</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : categories.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderOpen size={32} className="text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : totalItems}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText size={32} className="text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Items Activos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : totalItems}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Gestión de Categorías</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              Administra las categorías de recursos disponibles
            </p>
            <div className="flex space-x-3">
              <Link href="/admin/categories">
                <Button>Ver Categorías</Button>
              </Link>
              <Link href="/admin/categories/new">
                <Button variant="outline">
                  <Plus size={16} className="mr-1" />
                  Nueva Categoría
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Sitio Público</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              Visualiza cómo se ve el sitio para los usuarios
            </p>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Ver Sitio Público</Button>
            </a>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
