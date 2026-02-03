'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getCategories, getCategoryItems, deleteItem } from '@/lib/api';
import { getIcon } from '@/lib/iconMap';

export default function CategoryItemsPage() {
  const params = useParams();
  const categoryId = params.id;
  
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadData = useCallback(async () => {
    try {
      const categories = await getCategories();
      const cat = categories.find(c => c.id === categoryId);
      setCategory(cat);
      
      const itemsData = await getCategoryItems(categoryId);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);
  
  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId, loadData]);
  
  const handleDelete = async (id, title) => {
    if (!confirm(`¿Estás seguro de eliminar el item "${title}"?`)) {
      return;
    }
    
    try {
      await deleteItem(id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      alert('Error al eliminar el item');
      console.error('Error deleting item:', error);
    }
  };
  
  const getTypeVariant = (type) => {
    const map = {
      YOUTUBE: 'youtube',
      DRIVE: 'drive',
      ONEDRIVE: 'onedrive',
      OTHER: 'other',
    };
    return map[type] || 'default';
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-gray-500">Cargando...</p>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-gray-500">Categoría no encontrada</p>
      </div>
    );
  }
  
  const Icon = getIcon(category.iconKey);
  const iconColor = category.iconColor || '#3b82f6';
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} className="mr-1" />
          Volver a Categorías
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${iconColor}20` }}
            >
              <Icon size={32} style={{ color: iconColor }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">Gestiona los items de esta categoría</p>
            </div>
          </div>
          
          <Link href={`/admin/categories/${categoryId}/items/new`}>
            <Button>
              <Plus size={20} className="mr-2" />
              Nuevo Item
            </Button>
          </Link>
        </div>
      </div>
      
      {items.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500 mb-4">No hay items en esta categoría</p>
            <Link href={`/admin/categories/${categoryId}/items/new`}>
              <Button>Crear Primer Item</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => {
                const ItemIcon = getIcon(item.iconKey);
                const itemIconColor = item.iconColor || iconColor;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${itemIconColor}20` }}
                        >
                          <ItemIcon size={20} style={{ color: itemIconColor }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getTypeVariant(item.type)}>
                        {item.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <span className="truncate max-w-xs">{item.url}</span>
                        <ExternalLink size={14} className="ml-1 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/categories/${categoryId}/items/${item.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(item.id, item.title)}
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
