'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, Eye, Calendar, Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ServiceJob {
  id: number;
  customerName: string;
  scheduledDate: string;
  status: 'planned' | 'completed' | 'cancelled' | 'no_show';
  jobType: 'installation' | 'repair' | 'service';
  warrantyStatus: 'in_warranty' | 'in_contract' | 'out_of_warranty';
  engineerName?: string;
  billedAmount?: number;
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<ServiceJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(true);

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
        // Map UI filter to API filter values
        const filterMap: Record<string, string> = {
          planned: 'planned',
          completed: 'completed',
          cancelled: 'cancelled',
          no_show: 'no_show',
          today: 'today',
          overdue: 'overdue',
        };
        if (filterBy in filterMap) params.set('filterBy', filterMap[filterBy]);
        const res = await fetch(`/api/services${params.toString() ? `?${params.toString()}` : ''}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load services');
        const data = await res.json();
        setServices(
          data.map((s: any) => ({
            id: s.id,
            customerName: s.customer?.fullName ?? '—',
            scheduledDate: s.scheduledDate,
            status: s.status.toLowerCase(),
            jobType: s.jobType.toLowerCase(),
            warrantyStatus: s.warrantyStatus.toLowerCase(),
            engineerName: s.engineer?.name ?? undefined,
            billedAmount: s.billedAmount ?? undefined,
          }))
        );
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [searchTerm, filterBy]);

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.engineerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'planned') return matchesSearch && service.status === 'planned';
    if (filterBy === 'completed') return matchesSearch && service.status === 'completed';
    if (filterBy === 'cancelled') return matchesSearch && service.status === 'cancelled';
    if (filterBy === 'no_show') return matchesSearch && service.status === 'no_show';
    if (filterBy === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return matchesSearch && service.scheduledDate === today;
    }
    if (filterBy === 'overdue') {
      const today = new Date();
      const scheduledDate = new Date(service.scheduledDate);
      return matchesSearch && scheduledDate < today && service.status === 'planned';
    }
    if (filterBy === 'due_30_days') {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      const scheduledDate = new Date(service.scheduledDate);
      return matchesSearch && scheduledDate >= today && scheduledDate <= thirtyDaysFromNow && service.status === 'planned';
    }
    if (filterBy === 'completed_month') {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const scheduledDate = new Date(service.scheduledDate);
      return matchesSearch && service.status === 'completed' && scheduledDate >= firstDayOfMonth;
    }
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return { text: 'Planned', color: 'bg-blue-100 text-blue-800', icon: Clock };
      case 'completed':
        return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'cancelled':
        return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'no_show':
        return { text: 'No Show', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getWarrantyBadge = (status: string) => {
    switch (status) {
      case 'in_warranty':
        return 'bg-green-100 text-green-800';
      case 'in_contract':
        return 'bg-blue-100 text-blue-800';
      case 'out_of_warranty':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'installation':
        return '🔧';
      case 'repair':
        return '🔨';
      case 'service':
        return '⚙️';
      default:
        return '🔧';
    }
  };

  const plannedServices = services.filter(s => s.status === 'planned').length;
  const completedServices = services.filter(s => s.status === 'completed').length;
  const overdueServices = services.filter(s => {
    const today = new Date();
    const scheduledDate = new Date(s.scheduledDate);
    return scheduledDate < today && s.status === 'planned';
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600">Service management and scheduling</p>
            </div>
            <Link href="/services/new" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Schedule Service</span>
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
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planned</p>
                <p className="text-2xl font-bold text-gray-900">{plannedServices}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedServices}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueServices}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
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
                  placeholder="Search by customer name or engineer..."
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
                <option value="all">All Services</option>
                <option value="planned">Planned</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
                <option value="today">Today</option>
                <option value="overdue">Overdue</option>
                <option value="due_30_days">Due in Next 30 Days</option>
                <option value="completed_month">Completed This Month</option>
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
                <strong>Filter Applied:</strong> {filterBy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {filteredServices.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Services Table */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engineer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warranty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => {
                    const statusBadge = getStatusBadge(service.status);
                    const StatusIcon = statusBadge.icon;
                    return (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getJobTypeIcon(service.jobType)}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {service.jobType.charAt(0).toUpperCase() + service.jobType.slice(1)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {service.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(service.scheduledDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.engineerName || 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWarrantyBadge(service.warrantyStatus)}`}>
                            {service.warrantyStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/services/${service.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {service.status === 'planned' && (
                              <Link
                                href={`/services/${service.id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Wrench className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No services found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
