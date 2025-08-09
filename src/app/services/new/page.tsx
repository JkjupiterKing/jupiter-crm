'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    customerId: '',
    customerProductId: '',
    scheduledDate: '',
    status: 'PLANNED',
    jobType: 'SERVICE',
    warrantyStatus: 'IN_WARRANTY',
    engineerId: '',
    problemDescription: '',
    billedAmount: '',
    items: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [customersRes] = await Promise.all([
          fetch('/api/customers', { signal: controller.signal }),
        ]);
        if (customersRes.ok) setCustomers(await customersRes.json());
        // Engineers list would require a new API; keep empty for now
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
        customerProductId: formData.customerProductId ? Number(formData.customerProductId) : null,
        scheduledDate: formData.scheduledDate,
        engineerId: formData.engineerId ? Number(formData.engineerId) : null,
        billedAmount: formData.billedAmount ? Number(formData.billedAmount) : null,
      };
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create service');
      router.push('/services');
    } catch (e) {
      console.error(e);
      alert('Failed to create service');
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
              <Link href="/services" className="btn-secondary flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule Service</h1>
                <p className="text-gray-600">Create a service job</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
              <input type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="input-field">
                <option value="SERVICE">Service</option>
                <option value="INSTALLATION">Installation</option>
                <option value="REPAIR">Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Status</label>
              <select name="warrantyStatus" value={formData.warrantyStatus} onChange={handleChange} className="input-field">
                <option value="IN_WARRANTY">In Warranty</option>
                <option value="IN_CONTRACT">In Contract</option>
                <option value="OUT_OF_WARRANTY">Out of Warranty</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
              <textarea name="problemDescription" value={formData.problemDescription} onChange={handleChange} rows={3} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Billed Amount</label>
              <input type="number" name="billedAmount" value={formData.billedAmount} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Link href="/services" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Create Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


