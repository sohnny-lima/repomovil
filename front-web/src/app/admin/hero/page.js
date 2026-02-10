'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardBody } from '@/components/ui/Card';
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, uploadFile } from '@/lib/api';
import { BRANDING } from '@/lib/constants';

export default function AdminHeroPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const data = await getHeroSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide) => {
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      imageUrl: slide.imageUrl || '',
      linkUrl: slide.linkUrl || '',
      order: slide.order || 0,
      isActive: slide.isActive
    });
    setEditingId(slide.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta diapositiva?')) return;
    try {
      await deleteHeroSlide(id);
      loadSlides();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateHeroSlide(editingId, formData);
      } else {
        await createHeroSlide(formData);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadSlides();
    } catch (error) {
      alert('Error al guardar');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      order: 0,
      isActive: true
    });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión del Carrusel (Hero)</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} icon={Plus}>
            Nueva Diapositiva
          </Button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <Card className="border border-indigo-100 shadow-lg">
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-900">
                {editingId ? 'Editar Diapositiva' : 'Nueva Diapositiva'}
              </h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ej: Bienvenidos"
                />
                <Input
                  label="Subtítulo"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder={BRANDING.PLACEHOLDER_SUBTITLE}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="URL o subir archivo..."
                      className="flex-1"
                      required
                    />
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg border border-gray-300 transition-colors flex items-center justify-center" title="Subir desde PC">
                      <Upload size={20} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          try {
                            // Show loading state or similar if needed
                            const res = await uploadFile(file);
                            // Assuming backend returns full URL or we prepend API_URL.
                            // Since we serve static at /uploads, and frontend likely proxies /api,
                            // we need to construct the full URL if it's relative.
                            // However, backend public route returns /uploads/filename.
                            // Let's assume absolute path for now or reliable relative.
                            // Ideally, prepend backend URL. 
                            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
                            const fullUrl = `${backendUrl}${res.url}`;
                            setFormData({...formData, imageUrl: fullUrl});
                          } catch (err) {
                            alert('Error al subir imagen');
                            console.error(err);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pega una URL o sube una imagen.</p>
                </div>

                <Input
                  label="Enlace (Botón)"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <Input
                  label="Orden"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                />
                 <label className="flex items-center space-x-2 cursor-pointer mt-6">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                  />
                  <span className="text-gray-700">Activo</span>
                </label>
              </div>
              
              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 inline-block">
                  <span className="text-xs text-gray-500 mb-1 block">Vista Previa:</span>
                  <div className="relative h-32 w-48">
                    <Image 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      fill
                      className="object-cover rounded" 
                      unoptimized
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancelar
                </Button>
                <Button type="submit" icon={Save}>
                  Guardar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* List Section */}
      <div className="grid gap-6">
        {loading ? (
          <p className="text-gray-500">Cargando diapositivas...</p>
        ) : slides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No hay diapositivas creadas</p>
          </div>
        ) : (
          slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row items-center gap-6">
              {/* Image Thumbnail */}
              <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                <Image 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!slide.isActive && (
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                     <span className="text-white text-xs font-bold px-2 py-1 bg-gray-800/80 rounded">INACTIVO</span>
                   </div>
                )}
              </div>
              
              {/* Details */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className="font-bold text-lg text-gray-900">{slide.title || '(Sin título)'}</h3>
                <p className="text-gray-600 text-sm">{slide.subtitle}</p>
                {slide.linkUrl && (
                  <p className="text-indigo-500 text-xs truncate max-w-md">{slide.linkUrl}</p>
                )}
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  Orden: {slide.order}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(slide)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
