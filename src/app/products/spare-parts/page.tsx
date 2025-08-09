'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';

interface SparePart {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price?: number;
  stockQuantity: number;
  isActive: boolean;
  product?: { id: number; name: string } | null;
}

export default function SparePartsPage() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      try {
        const res = await fetch('/api/products?filterBy=active', { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      }
    }
    loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (filterBy !== 'all') params.set('filterBy', filterBy);
        if (productFilter !== 'all') params.set('productId', productFilter);
        const res = await fetch(`/api/spare-parts${params.toString() ? `?${params.toString()}` : ''}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load spare parts');
        const data = await res.json();
        setParts(data);
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [searchTerm, filterBy, productFilter]);

  async function handleDelete(id: number) {
    if (!confirm('Delete this spare part?')) return;
    try {
      const res = await fetch(`/api/spare-parts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setParts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Spare Parts</h1>
              <p className="text-gray-600">Manage spare parts inventory</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/products/new" className="btn-secondary">Products</Link>
              <Link href="/products/spare-parts/new" className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Spare Part</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="input-field">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="low-stock">Low Stock</option>
              </select>
              <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="input-field">
                <option value="all">All Products</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading spare parts...</p>
            </div>
          ) : (
            parts.map((part) => {
              const stockStatus = getStockStatus(part.stockQuantity);
              return (
                <div key={part.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{part.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {part.sku}</p>
                      {part.product && (
                        <p className="text-sm text-gray-500">Product: {part.product.name}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/products/spare-parts/${part.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(part.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {part.description && <p className="text-sm text-gray-600 mb-4">{part.description}</p>}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="text-sm font-medium text-gray-900">{part.price ? `₹${part.price.toLocaleString()}` : 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Stock:</span>
                      <span className="text-sm font-medium text-gray-900">{part.stockQuantity} units</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>{stockStatus.text}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!loading && parts.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No spare parts found</p>
            <Link href="/products/spare-parts/new" className="btn-primary mt-4">Add your first spare part</Link>
          </div>
        )}
      </div>
    </div>
  );
}


