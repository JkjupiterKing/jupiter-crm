'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  Wrench, 
  ShoppingCart, 
  Bell, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalSales: number;
  totalServiceRequests: number;
}

interface AlertStats {
  servicesDueInNext30Days: number;
  servicesOverdue: number;
  servicesPlanned: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalServiceRequests: 0,
  });

  const [alertStats, setAlertStats] = useState<AlertStats>({
    servicesDueInNext30Days: 0,
    servicesOverdue: 0,
    servicesPlanned: 0,
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch('/api/dashboard', { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadAlerts() {
      try {
        const res = await fetch('/api/dashboard/alerts', { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setAlertStats(data);
        }
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e);
      }
    }
    loadAlerts();
    return () => controller.abort();
  }, []);

  const quickActions = [
    {
      title: 'Add Customer',
      description: 'Register new customer',
      icon: Users,
      href: '/customers/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Product',
      description: 'Add new product to inventory',
      icon: Package,
      href: '/products/new',
      color: 'bg-green-500'
    },
    {
      title: 'Create Sale',
      description: 'Generate new sale invoice',
      icon: ShoppingCart,
      href: '/sales/new',
      color: 'bg-purple-500'
    },
    {
      title: 'Schedule Service',
      description: 'Book service appointment',
      icon: Wrench,
      href: '/services/new',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/services?filter=due_in_30_days" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Services Due (30 Days)</p>
                  <p className="text-2xl font-bold text-gray-900">{alertStats.servicesDueInNext30Days}</p>
                </div>
              </div>
            </Link>
            <Link href="/services?filter=due_status:OVERDUE" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Service Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{alertStats.servicesOverdue}</p>
                </div>
              </div>
            </Link>
            <Link href="/services?filter=visit_status:PLANNED" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Services Planned</p>
                  <p className="text-2xl font-bold text-gray-900">{alertStats.servicesPlanned}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-3.5 rounded-full ${action.color} bg-opacity-10`}>
                      <action.icon className={`w-7 h-7 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 text-base">{action.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid - Right Sidebar */}
          <div>
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Key Metrics</h2>
              <div className="space-y-2">
                <div className="flex items-center p-1.5 bg-blue-50 rounded-md">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-600">Total Customers</p>
                    <p className="text-base font-bold text-gray-900">{stats.totalCustomers}</p>
                  </div>
                </div>

                <div className="flex items-center p-1.5 bg-green-50 rounded-md">
                  <div className="p-1 rounded-full bg-green-100">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-600">Products</p>
                    <p className="text-base font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                </div>

                <div className="flex items-center p-1.5 bg-purple-50 rounded-md">
                  <div className="p-1 rounded-full bg-purple-100">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-600">Total Sales</p>
                    <p className="text-base font-bold text-gray-900">{stats.totalSales}</p>
                  </div>
                </div>

                <div className="flex items-center p-1.5 bg-orange-50 rounded-md">
                  <div className="p-1 rounded-full bg-orange-100">
                    <Wrench className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-600">Total Service Requests</p>
                    <p className="text-base font-bold text-gray-900">{stats.totalServiceRequests}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Link href="/customers" className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Users className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">Customers</h3>
                <p className="text-xs text-gray-600 mt-1">Manage customer database</p>
              </div>
            </Link>

            <Link href="/products" className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Package className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">Products</h3>
                <p className="text-xs text-gray-600 mt-1">Inventory management</p>
              </div>
            </Link>

            <Link href="/sales" className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <ShoppingCart className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">Sales</h3>
                <p className="text-xs text-gray-600 mt-1">Sales and billing</p>
              </div>
            </Link>

            <Link href="/services" className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Wrench className="w-10 h-10 text-orange-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">Services</h3>
                <p className="text-xs text-gray-600 mt-1">Service management</p>
              </div>
            </Link>

            <Link href="/reports" className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">Reports</h3>
                <p className="text-xs text-gray-600 mt-1">Business analytics</p>
              </div>
            </Link>

            <Link href="/settings" className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Settings className="w-10 h-10 text-gray-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">Settings</h3>
                <p className="text-xs text-gray-600 mt-1">App configuration</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
