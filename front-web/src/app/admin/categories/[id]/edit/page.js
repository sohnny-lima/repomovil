'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getCategories, updateCategory } from '@/lib/api';
import { getAvailableIcons, getIcon } from '@/lib/iconMap';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  iconKey: z.string().optional(),
  iconColor: z.string().optional(),
  isActive: z.boolean(),
});

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconKey: 'folder',
    iconColor: '#3b82f6',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const loadCategory = useCallback(async () => {
    try {
      const categories = await getCategories();
      const category = categories.find(c => c.id === categoryId);
      
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          iconKey: category.iconKey || 'folder',
          iconColor: category.iconColor || '#3b82f6',
          isActive: category.isActive !== false,
        });
      }
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
    
    const result = categorySchema.safeParse(formData);
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
      await updateCategory(categoryId, formData);
      router.push('/admin/categories');
    } catch (error) {
      alert('Error al actualizar la categoría');
      console.error('Error updating category:', error);
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
  
  const availableIcons = getAvailableIcons();
  const PreviewIcon = getIcon(formData.iconKey);
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} className="mr-1" />
          Volver a Categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Categoría</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Información de la Categoría</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <Input
              type="text"
              name="name"
              label="Nombre *"
              placeholder="Ej: Videos Educativos"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={saving}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Descripción opcional de la categoría"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono
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
                  Color
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
            
            {/* Icon Preview */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">Vista Previa</p>
              <div className="flex items-center space-x-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${formData.iconColor}20` }}
                >
                  <PreviewIcon size={32} style={{ color: formData.iconColor }} />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">
                    {formData.name || 'Nombre de la categoría'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.description || 'Descripción de la categoría'}
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
                Categoría activa (visible en el sitio público)
              </label>
            </div>
          </CardBody>
        </Card>
        
        <div className="mt-6 flex items-center justify-end space-x-3">
          <Link href="/admin/categories">
            <Button type="button" variant="outline" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" loading={saving} disabled={saving}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
