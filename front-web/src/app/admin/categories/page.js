'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getCategories, deleteCategory } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id, name) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${name}"? Esto eliminará todos sus items.`)) {
      return;
    }
    
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert('Error al eliminar la categoría');
      console.error('Error deleting category:', error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de recursos</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Nueva Categoría
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No hay categorías creadas</p>
            <Link href="/admin/categories/new">
              <Button>Crear Primera Categoría</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => {
                const Icon = getIcon(category.iconKey);
                const iconColor = category.iconColor || '#3b82f6';
                
                return (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${iconColor}20` }}
                        >
                          <Icon size={20} style={{ color: iconColor }} />
                        </div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {category.description || 'Sin descripción'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {category.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/categories/${category.id}/items`}>
                          <Button size="sm" variant="outline">
                            <FolderOpen size={16} className="mr-1" />
                            Items
                          </Button>
                        </Link>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(category.id, category.name)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
