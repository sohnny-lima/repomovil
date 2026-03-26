'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, FileText, ChevronRight, Loader2 } from 'lucide-react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import { getAdminMinistries } from '@/lib/api';

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminMinistries()
      .then((d) => setMinistries(d?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ministerios</h1>
        <p className="text-gray-600">Gestiona los recursos de cada ministerio por defecto</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={36} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ministries.map((m) => (
            <Link key={m.id} href={`/admin/ministerios/${m.id}/recursos`}>
              <Card className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Building2 size={22} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{m.name}</p>
                        <p className="text-sm text-gray-500">
                          {m._count?.resources ?? 0} recurso{m._count?.resources !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
