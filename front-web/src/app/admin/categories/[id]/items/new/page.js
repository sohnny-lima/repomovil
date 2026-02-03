'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createItem, getCategories } from '@/lib/api';
import { getAvailableIcons, getIcon } from '@/lib/iconMap';

const itemSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  url: z.string().refine((val) => {
    try {
      const u = new URL(val);
      return ['http:', 'https:'].includes(u.protocol);
    } catch {
      return false;
    }
  }, { message: 'URL inválida' }),
  type: z.enum(['YOUTUBE', 'DRIVE', 'ONEDRIVE', 'OTHER']).optional(),
  description: z.string().optional(),
  iconKey: z.string().optional(),
  iconColor: z.string().optional(),
  isActive: z.boolean(),
});

export default function NewItemPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id;
  
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: categoryId,
    title: '',
    url: '',
    type: 'OTHER',
    description: '',
    iconKey: 'link',
    iconColor: '#3b82f6',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const loadCategory = useCallback(async () => {
    try {
      const categories = await getCategories();
      const cat = categories.find(c => c.id === categoryId);
      setCategory(cat);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);
  
  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId, loadCategory]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const result = itemSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setSaving(true);
    
    try {
      // Backend will auto-detect type if not provided
      const dataToSend = { ...formData };
      if (!dataToSend.type || dataToSend.type === 'OTHER') {
        delete dataToSend.type; // Let backend detect
      }
      
      await createItem(dataToSend);
      router.push(`/admin/categories/${categoryId}/items`);
    } catch (error) {
      alert('Error al crear el item');
      console.error('Error creating item:', error);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-gray-500">Cargando...</p>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-gray-500">Categoría no encontrada</p>
      </div>
    );
  }
  
  const availableIcons = getAvailableIcons();
  const PreviewIcon = getIcon(formData.iconKey);
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/admin/categories/${categoryId}/items`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} className="mr-1" />
          Volver a Items de {category.name}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Item</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Información del Item</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <Input
              type="text"
              name="title"
              label="Título *"
              placeholder="Ej: Video Tutorial de React"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              disabled={saving}
            />
            
            <Input
              type="url"
              name="url"
              label="URL *"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.url}
              onChange={handleChange}
              error={errors.url}
              disabled={saving}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={saving}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="DRIVE">Google Drive</option>
                <option value="ONEDRIVE">OneDrive</option>
                <option value="OTHER">Otro (auto-detectar)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Si seleccionas &quot;Otro&quot;, el sistema detectará automáticamente el tipo según la URL
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Descripción opcional del recurso"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono (opcional)
                </label>
                <select
                  name="iconKey"
                  value={formData.iconKey}
                  onChange={handleChange}
                  disabled={saving}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color (opcional)
                </label>
                <input
                  type="color"
                  name="iconColor"
                  value={formData.iconColor}
                  onChange={handleChange}
                  disabled={saving}
                  className="block w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">Vista Previa</p>
              <div className="flex items-start space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${formData.iconColor}20` }}
                >
                  <PreviewIcon size={24} style={{ color: formData.iconColor }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    {formData.title || 'Título del item'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.description || 'Descripción del item'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {formData.url || 'https://...'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Item activo (visible en el sitio público)
              </label>
            </div>
          </CardBody>
        </Card>
        
        <div className="mt-6 flex items-center justify-end space-x-3">
          <Link href={`/admin/categories/${categoryId}/items`}>
            <Button type="button" variant="outline" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" loading={saving} disabled={saving}>
            Crear Item
          </Button>
        </div>
      </form>
    </div>
  );
}
