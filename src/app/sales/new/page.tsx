'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    customerId: '',
    invoiceNumber: '',
    date: '',
    total: '',
    paymentMode: '',
    notes: '',
    items: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch('/api/customers', { signal: controller.signal });
        if (res.ok) setCustomers(await res.json());
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        customerId: Number(formData.customerId),
        date: formData.date || new Date().toISOString(),
        total: Number(formData.total || 0),
        items: Array.isArray(formData.items) ? formData.items : [],
      };
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create sale');
      router.push('/sales');
    } catch (e) {
      console.error(e);
      alert('Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/sales" className="btn-secondary flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Sale</h1>
                <p className="text-gray-600">Generate a new sale invoice</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
              <select name="customerId" value={formData.customerId} onChange={handleChange} required className="input-field">
                <option value="">Select customer</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
              <input name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
              <input name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input type="number" name="total" value={formData.total} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Link href="/sales" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Create Sale'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


