'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createCategory } from '@/lib/api';
import http from '@/lib/http';
import { categorySchema } from '@/lib/schemas/category.schema';

export default function NewCategoryPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      isActive: true,
    },
  });

  // Watch for live preview
  const [watchedName, watchedDescription] = watch(['name', 'description']);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await http.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('imageUrl', response.data.url);
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue('imageUrl', '');
    setImagePreview('');
  };

  const onSubmit = async (data) => {
    try {
      await createCategory(data);
      router.push('/admin/categories');
    } catch (error) {
      alert('Error al crear la categoría');
      console.error('Error creating category:', error);
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Información de la Categoría</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <Input
              type="text"
              label="Nombre *"
              placeholder="Ej: Videos Educativos"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register('name')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                rows={3}
                placeholder="Descripción opcional de la categoría"
                disabled={isSubmitting}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('description')}
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
                    disabled={uploading || isSubmitting}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploading || isSubmitting
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`w-12 h-12 mb-3 ${uploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          {uploading ? 'Subiendo...' : 'Click para subir'}
                        </span>{' '}
                        o arrastra y suelta
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={192}
                    height={192}
                    unoptimized
                    className="w-48 h-48 object-cover rounded-2xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
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
                  <Image
                    src={imagePreview}
                    alt="Preview icon"
                    width={64}
                    height={64}
                    unoptimized
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
                    <Upload className="text-gray-400" size={32} />
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg text-gray-900">
                    {watchedName || 'Nombre de la categoría'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {watchedDescription || 'Descripción de la categoría'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('isActive')}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Categoría activa (visible en el sitio público)
              </label>
            </div>
          </CardBody>
        </Card>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <Link href="/admin/categories">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting || uploading}>
            Crear Categoría
          </Button>
        </div>
      </form>
    </div>
  );
}
