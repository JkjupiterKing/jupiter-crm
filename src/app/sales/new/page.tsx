'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toYYYYMMDD } from '@/lib/date-utils';

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    customerId: '',
    invoiceNumber: '',
    saleDate: toYYYYMMDD(new Date()),
    total: '',
    paymentMode: '',
    notes: '',
    items: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [customersRes, productsRes] = await Promise.all([
          fetch('/api/customers', { signal: controller.signal }),
          fetch('/api/products', { signal: controller.signal }),
        ]);
        if (customersRes.ok) setCustomers(await customersRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
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

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev: any) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: '', quantity: 1, unitPrice: 0, lineTotal: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, items: newItems }));
  };

  useEffect(() => {
    const total = formData.items.reduce((acc: number, item: any) => {
      const product = products.find(p => p.id === Number(item.productId));
      const price = product ? product.unitPrice : 0;
      const lineTotal = (Number(item.quantity) || 0) * (price || 0);
      return acc + lineTotal;
    }, 0);
    setFormData((prev: any) => ({ ...prev, totalAmount: total }));
  }, [formData.items, products]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        customerId: Number(formData.customerId),
        saleDate: formData.saleDate || toYYYYMMDD(new Date()),
        totalAmount: Number(formData.totalAmount || 0),
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
              <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
              <input name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input-field" />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sale Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line Total</th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item: any, index: number) => {
                    const product = products.find(p => p.id === Number(item.productId));
                    const price = product ? product.unitPrice : 0;
                    const lineTotal = (Number(item.quantity) || 0) * (price || 0);

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="input-field"
                          >
                            <option value="">Select a product</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lineTotal}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-900">
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <button type="button" onClick={addItem} className="btn-secondary">
                Add Item
              </button>
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


