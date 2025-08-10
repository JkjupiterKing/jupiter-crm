'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, Eye, Receipt, DollarSign, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

interface Sale {
  id: number;
  customerName: string;
  invoiceNumber: string;
  saleDate: string;
  totalAmount: number;
  paymentMode: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  notes: string;
  itemsCount: number;
}

export default function SalesPage() {
  const searchParams = useSearchParams();
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    // Handle URL parameters for filtering
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setFilterBy(filterParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (filterBy !== 'all') params.set('filterBy', filterBy);
        const res = await fetch(`/api/sales${params.toString() ? `?${params.toString()}` : ''}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load sales');
        const data = await res.json();
        
        // Transform the API response to match the expected interface
        const transformedSales = data.map((sale: any) => ({
          id: sale.id,
          customerName: sale.customer?.fullName || 'Unknown Customer',
          invoiceNumber: sale.invoiceNumber,
          saleDate: sale.saleDate,
          totalAmount: sale.totalAmount,
          paymentMode: sale.paymentMode || 'N/A',
          status: sale.status,
          notes: sale.notes || '',
          itemsCount: sale.items?.length || 0,
        }));
        
        setSales(transformedSales);
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [searchTerm, filterBy]);

  const handleDelete = async (saleId: number) => {
    if (!confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(saleId);
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the sale from the local state
        setSales(prev => prev.filter(sale => sale.id !== saleId));
      } else {
        const error = await response.json();
        alert(`Failed to delete sale: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Failed to delete sale. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.paymentMode.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'paid') return matchesSearch && sale.status === 'PAID';
    if (filterBy === 'pending') return matchesSearch && sale.status === 'PENDING';
    if (filterBy === 'cancelled') return matchesSearch && sale.status === 'CANCELLED';
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return { text: 'Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'PENDING':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'CANCELLED':
        return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  // Calculate metrics
  const totalSales = sales.length;
  const paidSales = sales.filter(s => s.status === 'PAID').length;
  const pendingSales = sales.filter(s => s.status === 'PENDING').length;
  const totalRevenue = sales.filter(s => s.status === 'PAID').reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
              <p className="text-gray-600">Sales management and invoicing</p>
            </div>
            <Link href="/sales/new" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Sale</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{paidSales}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingSales}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice number, customer name, or payment mode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="input-field"
              >
                <option value="all">All Sales</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {filterBy !== 'all' && (
                <button
                  onClick={() => setFilterBy('all')}
                  className="btn-secondary"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
          {filterBy !== 'all' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Filter Applied:</strong> {filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
                {filteredSales.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({filteredSales.length} {filteredSales.length === 1 ? 'sale' : 'sales'} found)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Sales Table */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading sales...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.map((sale) => {
                    const statusBadge = getStatusBadge(sale.status);
                    const StatusIcon = statusBadge.icon;
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{sale.invoiceNumber}</div>
                              <div className="text-sm text-gray-500">{sale.itemsCount} items</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{sale.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.paymentMode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/sales/${sale.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {sale.status === 'PENDING' && (
                              <Link
                                href={`/sales/${sale.id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <DollarSign className="w-4 h-4" />
                              </Link>
                            )}
                            <button
                              onClick={() => handleDelete(sale.id)}
                              disabled={deletingId === sale.id}
                              className="text-red-600 hover:text-red-900"
                            >
                              {deletingId === sale.id ? (
                                <div className="animate-spin h-4 w-4" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredSales.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No sales found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
