'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, Eye, Calendar, Wrench, Clock, CheckCircle, AlertTriangle, ShieldCheck, ShieldAlert, Bell } from 'lucide-react';
import { ServiceVisitStatus, Customer } from '@prisma/client';

enum ServiceDueStatus {
  DUE = 'DUE',
  OVERDUE = 'OVERDUE',
}

interface ServiceJob {
  id: number;
  customer: Customer;
  visitScheduledDate?: string;
  serviceDueDate: string;
  serviceDueStatus: ServiceDueStatus;
  serviceVisitStatus: ServiceVisitStatus;
  jobType: 'INSTALLATION' | 'REPAIR' | 'SERVICE';
  warrantyStatus: 'IN_WARRANTY' | 'IN_CONTRACT' | 'OUT_OF_WARRANTY';
  engineerName?: string;
  billedAmount?: number;
  customerProductId: number;
  customerProduct: {
    product: {
      name: string;
    };
  };
}

interface ServiceMetrics {
  due: number;
  overdue: number;
  unscheduled: number;
  planned: number;
}

import SendAlertModal from '@/components/SendAlertModal';

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<ServiceJob[]>([]);
  const [metrics, setMetrics] = useState<ServiceMetrics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceJob | null>(null);

  const handleOpenAlertModal = (service: ServiceJob) => {
    setSelectedService(service);
    setAlertModalOpen(true);
  };

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) {
          params.set('search', searchTerm);
        }
        if (filter !== 'all') {
          if (filter.includes(':')) {
            const [filterType, filterValue] = filter.split(':');
            if (filterType === 'due_status') {
              params.set('due_status', filterValue);
            } else if (filterType === 'visit_status') {
              params.set('visit_status', filterValue);
            }
          } else {
            params.set('filter', filter);
          }
        }

        // Fetch services and metrics in parallel
        const [servicesRes, metricsRes] = await Promise.all([
          fetch(`/api/services?${params.toString()}`, { signal }),
          fetch(`/api/services/counts?${params.toString()}`, { signal })
        ]);

        if (!servicesRes.ok) throw new Error('Failed to load services');
        const servicesData: ServiceJob[] = await servicesRes.json();
        setServices(
          servicesData.map((s) => ({
            id: s.id,
            customer: s.customer,
            visitScheduledDate: s.visitScheduledDate,
            serviceDueDate: s.serviceDueDate,
            serviceDueStatus: s.serviceDueStatus,
            serviceVisitStatus: s.serviceVisitStatus,
            jobType: s.jobType,
            warrantyStatus: s.warrantyStatus,
            engineerName: s.engineer?.name ?? undefined,
            billedAmount: s.billedAmount ?? undefined,
            customerProductId: s.customerProductId,
            customerProduct: s.customerProduct,
          }))
        );

        if (!metricsRes.ok) throw new Error('Failed to load metrics');
        const metricsData: ServiceMetrics = await metricsRes.json();
        setMetrics(metricsData);

      } catch (e) {
        if ((e as Error).name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [searchTerm, filter]);

  const getServiceDueStatusBadge = (status: ServiceDueStatus) => {
    switch (status) {
      case 'DUE':
        return { text: 'Due', color: 'bg-blue-100 text-blue-800', icon: ShieldCheck };
      case 'OVERDUE':
        return { text: 'Overdue', color: 'bg-red-100 text-red-800', icon: ShieldAlert };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getServiceVisitStatusBadge = (status: ServiceVisitStatus) => {
    switch (status) {
      case 'PLANNED':
        return { text: 'Planned', color: 'bg-blue-100 text-blue-800', icon: Clock };
      case 'COMPLETED':
        return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'CANCELLED':
        return { text: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'UNSCHEDULED':
        return { text: 'Unscheduled', color: 'bg-gray-100 text-gray-800', icon: Calendar };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getWarrantyBadge = (status: string) => {
    switch (status) {
      case 'IN_WARRANTY':
        return 'bg-green-100 text-green-800';
      case 'IN_CONTRACT':
        return 'bg-blue-100 text-blue-800';
      case 'OUT_OF_WARRANTY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'INSTALLATION':
        return '🔧';
      case 'REPAIR':
        return '🔨';
      case 'SERVICE':
        return '🛠️';
      default:
        return '🔧';
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card" data-testid="metric-card-due">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.due ?? '...'}</p>
              </div>
            </div>
          </div>

          <div className="card" data-testid="metric-card-overdue">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.overdue ?? '...'}</p>
              </div>
            </div>
          </div>

          <div className="card" data-testid="metric-card-unscheduled">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unscheduled</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.unscheduled ?? '...'}</p>
              </div>
            </div>
          </div>

          <div className="card" data-testid="metric-card-planned">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planned</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.planned ?? '...'}</p>
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
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Services</option>
                <optgroup label="By Due Status">
                  <option value="due_in_30_days">Due in next 30 days</option>
                  <option value="due_status:DUE">Due</option>
                  <option value="due_status:OVERDUE">Overdue</option>
                </optgroup>
                <optgroup label="By Visit Status">
                  <option value="visit_status:UNSCHEDULED">Unscheduled</option>
                  <option value="visit_status:PLANNED">Planned</option>
                  <option value="visit_status:COMPLETED">Completed</option>
                  <option value="visit_status:CANCELLED">Cancelled</option>
                </optgroup>
              </select>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="btn-secondary"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
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
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {/* No Header for Send Alert */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Scheduled Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engineer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Status
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
                  {services.map((service) => {
                    const dueStatusBadge = getServiceDueStatusBadge(service.serviceDueStatus);
                    const DueStatusIcon = dueStatusBadge.icon;
                    const visitStatusBadge = getServiceVisitStatusBadge(service.serviceVisitStatus);
                    const VisitStatusIcon = visitStatusBadge.icon;

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
                        <td className="px-2 py-4 whitespace-nowrap">
                          {(service.serviceDueStatus === 'DUE' || service.serviceDueStatus === 'OVERDUE') && (
                            <button
                              onClick={() => handleOpenAlertModal(service)}
                              className="btn-secondary text-xs"
                            >
                              Send Alert
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.customer.fullName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.customerProduct.product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.visitScheduledDate ? new Date(service.visitScheduledDate).toLocaleDateString() : 'Not Scheduled'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.engineerName || 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(service.serviceDueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${dueStatusBadge.color}`}>
                            <DueStatusIcon className="w-3 h-3 mr-1" />
                            {dueStatusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${visitStatusBadge.color}`}>
                            <VisitStatusIcon className="w-3 h-3 mr-1" />
                            {visitStatusBadge.text}
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
                            {(service.serviceVisitStatus === 'PLANNED' || service.serviceVisitStatus === 'UNSCHEDULED') && (
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

          {!loading && services.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No services found</p>
            </div>
          )}
        </div>
      </div>
      <SendAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
