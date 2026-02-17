'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createCategory } from '@/lib/api';
import http from '@/lib/http';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
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
  
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await http.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const imageUrl = response.data.url;
      setFormData(prev => ({ ...prev, imageUrl }));
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImagePreview('');
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
    
    setLoading(true);
    
    try {
      await createCategory(formData);
      router.push('/admin/categories');
    } catch (error) {
      alert('Error al crear la categoría');
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} className="mr-1" />
          Volver a Categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Categoría</h1>
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
              disabled={loading}
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
                disabled={loading}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de la Categoría
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Sube una imagen cuadrada (recomendado: 512x512px). Máximo 5MB.
              </p>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading || loading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploading || loading
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`w-12 h-12 mb-3 ${uploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          {uploading ? 'Subiendo...' : 'Click para subir'}
                        </span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-2xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            
            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">Vista Previa</p>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview icon"
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
                    <Upload className="text-gray-400" size={32} />
                  </div>
                )}
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
                disabled={loading}
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
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" loading={loading} disabled={loading || uploading}>
            Crear Categoría
          </Button>
        </div>
      </form>
    </div>
  );
}
