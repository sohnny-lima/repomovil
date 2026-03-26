'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Pencil, Trash2, Save, X, ArrowLeft,
  FileText, Music, Video, File, Loader2, AlertCircle, Upload
} from 'lucide-react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  getAdminMinistryResources,
  createMinistryResource,
  updateMinistryResource,
  deleteMinistryResource,
  uploadResourceFile,
} from '@/lib/api';

// ── Config ────────────────────────────────────────────────────────────────
const RESOURCE_TYPES = ['PDF', 'PPTX', 'WORD', 'AUDIO', 'VIDEO'];

const TYPE_META = {
  PDF   : { label: 'PDF',   Icon: FileText, color: 'bg-red-100 text-red-600',         accept: '.pdf',              limitMB: 25  },
  PPTX  : { label: 'PPTX',  Icon: FileText, color: 'bg-orange-100 text-orange-600',    accept: '.ppt,.pptx',        limitMB: 250 },
  WORD  : { label: 'Word',  Icon: File,     color: 'bg-indigo-100 text-indigo-600',    accept: '.doc,.docx',        limitMB: 50  },
  AUDIO : { label: 'Audio', Icon: Music,    color: 'bg-green-100 text-green-600',      accept: '.mp3,.wav,.m4a',    limitMB: 50  },
  VIDEO : { label: 'Video', Icon: Video,    color: 'bg-blue-100 text-blue-600',        accept: '.mp4,.mov,.avi,.webm', limitMB: 250 },
};

const EMPTY_FORM = {
  title: '', description: '', type: 'PDF',
  fileUrl: '', storagePath: '', originalName: '', mimeType: '', extension: '', sizeBytes: null,
};

function formatBytes(bytes) {
  if (!bytes) return '';
  const mb = Number(bytes) / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(Number(bytes) / 1024)} KB`;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function AdminMinistryResourcesPage() {
  const { id } = useParams();
  const [resources, setResources]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editId, setEditId]             = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');
  const [ministryName, setMinistryName] = useState('Ministerio');
  const [ministrySlug, setMinistrySlug] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  const loadResources = useCallback(() => {
    if (!id) return;
    setLoading(true);
    getAdminMinistryResources(id)
      .then((d) => {
        setResources(d?.data || []);
        if (d?.ministryName) setMinistryName(d.ministryName);
        if (d?.slug) setMinistrySlug(d.slug);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadResources(); }, [loadResources]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check
    const meta   = TYPE_META[form.type];
    const limitB = (meta?.limitMB || 50) * 1024 * 1024;
    if (file.size > limitB) {
      setError(`El archivo excede el límite de ${meta?.limitMB ?? 50} MB para tipo ${form.type}`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const result = await uploadResourceFile(file, (pct) => setUploadProgress(pct));
      if (!result.ok) throw new Error(result.message || 'Upload failed');

      const f = result.file || {};
      setForm(prev => ({
        ...prev,
        fileUrl     : f.url      || result.url     || '',
        storagePath : f.storagePath                || '',
        originalName: f.originalName || file.name  || '',
        mimeType    : f.mimeType || file.type       || '',
        extension   : f.extension                  || '',
        sizeBytes   : f.sizeBytes || file.size      || null,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error subiendo archivo';
      setError(msg);
      if (fileRef.current) fileRef.current.value = '';
      setSelectedFile(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fileUrl) { setError('Debes subir un archivo primero'); return; }
    setSaving(true);
    setError('');
    try {
      if (editId) {
        await updateMinistryResource(id, editId, form);
      } else {
        await createMinistryResource(id, form);
      }
      resetForm();
      loadResources();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error guardando';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r) => {
    setEditId(r.id);
    setForm({
      title       : r.title,
      description : r.description || '',
      type        : r.type,
      fileUrl     : r.fileUrl     || '',
      storagePath : r.storagePath || '',
      originalName: r.originalName|| '',
      mimeType    : r.mimeType    || '',
      extension   : r.extension   || '',
      sizeBytes   : r.sizeBytes   || null,
    });
    setShowForm(true);
    setError('');
    setSelectedFile(null);
  };

  const handleDelete = async (rid) => {
    if (!confirm('¿Eliminar este recurso?')) return;
    try {
      await deleteMinistryResource(id, rid);
      setResources(rs => rs.filter(r => r.id !== rid));
    } catch {
      alert('Error al eliminar');
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    setError('');
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const activeMeta = TYPE_META[form.type] || TYPE_META.PDF;
  const isMayordomia = ministrySlug === 'mayordomia' || ministryName?.toLowerCase()?.includes('mayordom');

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/ministerios" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Volver a Ministerios
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recursos — {ministryName}</h1>
          <p className="text-gray-600 text-sm mt-1">Gestiona los archivos de este ministerio</p>
        </div>
        {!isMayordomia && !showForm && (
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setError(''); }}>
            <Plus size={16} className="mr-1" /> Nuevo recurso
          </Button>
        )}
      </div>

      {isMayordomia ? (
        <Card>
          <CardBody className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Administración centralizada</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              El ministerio de Mayordomía no utiliza este sistema de recursos directos. 
              Todo su contenido se administra usando el sistema originario desde la sección global de Categorías e Items.
            </p>
            <Link href="/admin/categories" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm">
              <FileText size={18} /> Ir a Administrar Categorías
            </Link>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Form */}
          {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">{editId ? 'Editar recurso' : 'Nuevo recurso'}</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Título *</label>
                  <input
                    type="text" required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Título del recurso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Tipo *</label>
                  <select
                    value={form.type}
                    onChange={e => {
                      setForm(f => ({ ...f, type: e.target.value }));
                      if (fileRef.current) fileRef.current.value = '';
                      setSelectedFile(null);
                      setError('');
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {RESOURCE_TYPES.map(t => (
                      <option key={t} value={t}>{TYPE_META[t]?.label || t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción opcional"
                />
              </div>

              {/* File upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-900">Archivo *</label>
                  <span className="text-xs font-bold text-gray-500">Máx. {activeMeta.limitMB} MB — {activeMeta.accept}</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors bg-white">
                  <div className="flex items-center gap-3">
                    <Upload size={20} className="text-gray-500 flex-shrink-0" />
                    <input
                      type="file"
                      ref={fileRef}
                      accept={activeMeta.accept}
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 disabled:opacity-50"
                    />
                    {uploading && <Loader2 size={16} className="animate-spin text-blue-500 flex-shrink-0" />}
                  </div>

                  {/* Selected file info */}
                  {selectedFile && !uploading && (
                    <p className="text-xs text-gray-500 mt-2 ml-7">
                      Seleccionado: <span className="font-medium">{selectedFile.name}</span>
                      {' '}({formatBytes(selectedFile.size)})
                    </p>
                  )}

                  {/* Upload progress */}
                  {uploading && uploadProgress > 0 && (
                    <div className="mt-2 ml-7">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Subiendo...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Success */}
                  {form.fileUrl && !uploading && (
                    <div className="mt-2 ml-7 text-xs text-green-600 flex items-center gap-1">
                      <span>✅</span>
                      <span className="font-medium">{form.originalName || form.fileUrl}</span>
                      {form.sizeBytes && <span className="text-gray-400">({formatBytes(form.sizeBytes)})</span>}
                    </div>
                  )}

                  {editId && !form.fileUrl && (
                    <p className="text-xs text-gray-400 mt-2 ml-7">Deja vacío para mantener el archivo actual</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? <Loader2 size={16} className="animate-spin mr-1" /> : <Save size={16} className="mr-1" />}
                  {saving ? 'Guardando...' : (editId ? 'Actualizar' : 'Crear recurso')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                  <X size={16} className="mr-1" /> Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={36} className="animate-spin text-blue-500" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <FileText size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No hay recursos. Crea el primero.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(r => {
            const meta = TYPE_META[r.type] || { Icon: FileText, color: 'bg-gray-100 text-gray-600', label: r.type };
            const Icon = meta.Icon;
            const size = r.sizeBytes ?? r.size;
            return (
              <Card key={r.id}>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${meta.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{r.title}</p>
                      <p className="text-xs text-gray-400">
                        {meta.label}
                        {size ? ` • ${formatBytes(size)}` : ''}
                        {r.originalName ? ` • ${r.originalName}` : ''}
                      </p>
                      {r.description && <p className="text-sm text-gray-500 truncate">{r.description}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEdit(r)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
