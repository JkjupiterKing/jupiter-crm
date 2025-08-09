'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditCustomerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`/api/customers/${params.id}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load customer');
        const data = await res.json();
        setFormData({
          fullName: data.fullName ?? '',
          doorNumber: data.doorNumber ?? '',
          street: data.street ?? '',
          area: data.area ?? '',
          layout: data.layout ?? '',
          district: data.district ?? '',
          pinCode: data.pinCode ?? '',
          mobile: data.mobile ?? '',
          altMobile: data.altMobile ?? '',
          email: data.email ?? '',
          notes: data.notes ?? '',
        });
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      } finally {
        setInitialLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update customer');
      router.push('/customers');
    } catch (e) {
      console.error(e);
      alert('Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/customers" className="btn-secondary flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
                <p className="text-gray-600">Update customer details</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input className="input-field" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Door Number</label>
              <input className="input-field" name="doorNumber" value={formData.doorNumber} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
              <input className="input-field" name="street" value={formData.street} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <input className="input-field" name="area" value={formData.area} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
              <input className="input-field" name="layout" value={formData.layout} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input className="input-field" name="district" value={formData.district} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
              <input className="input-field" name="pinCode" value={formData.pinCode} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
              <input className="input-field" name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt. Mobile</label>
              <input className="input-field" name="altMobile" value={formData.altMobile} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input className="input-field" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea className="input-field" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Link href="/customers" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


