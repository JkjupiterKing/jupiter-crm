'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`/api/products/${params.id}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load product');
        const data = await res.json();
        setFormData({
          name: data.name ?? '',
          category: data.category ?? '',
          sku: data.sku ?? '',
          description: data.description ?? '',
          unitPrice: data.unitPrice ?? '',
          costPrice: data.costPrice ?? '',
          currentStock: data.currentStock ?? 0,
          reorderLevel: data.reorderLevel ?? 5,
          manufacturer: data.manufacturer ?? '',
          model: data.model ?? '',
          warrantyPeriod: data.warrantyPeriod ?? 12,
          isActive: data.isActive ?? true,
          service_frequency: data.service_frequency ?? 'NONE',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          unitPrice: formData.unitPrice ? parseInt(String(formData.unitPrice), 10) : null,
          costPrice: formData.costPrice ? parseInt(String(formData.costPrice), 10) : null,
          currentStock: Number(formData.currentStock),
          reorderLevel: Number(formData.reorderLevel),
          warrantyPeriod: Number(formData.warrantyPeriod),
        }),
      });
      if (!res.ok) throw new Error('Failed to update product');
      router.push('/products');
    } catch (e) {
      console.error(e);
      alert('Failed to update product');
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
              <Link href="/products" className="btn-secondary flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600">Update product details</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input name="category" value={formData.category} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input name="sku" value={formData.sku} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
              <input type="number" name="unitPrice" value={formData.unitPrice as any} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
              <input type="number" name="costPrice" value={formData.costPrice as any} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
              <input type="number" name="currentStock" value={formData.currentStock as any} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
              <input type="number" name="reorderLevel" value={formData.reorderLevel as any} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
              <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input name="model" value={formData.model} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty (months)</label>
              <input type="number" name="warrantyPeriod" value={formData.warrantyPeriod as any} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Frequency</label>
              <select name="service_frequency" value={formData.service_frequency} onChange={handleChange} className="input-field">
                <option value="NONE">None</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="HALF_YEARLY">Half-Yearly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input id="isActive" type="checkbox" name="isActive" checked={!!formData.isActive} onChange={handleChange} />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Link href="/products" className="btn-secondary">Cancel</Link>
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


