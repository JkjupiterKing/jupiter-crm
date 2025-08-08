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
  Settings
} from 'lucide-react';

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalSales: number;
  pendingServices: number;
  serviceDue30Days: number;
  overdueServices: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalSales: 0,
    pendingServices: 0,
    serviceDue30Days: 0,
    overdueServices: 0
  });

  useEffect(() => {
    // TODO: Fetch actual stats from API
    setStats({
      totalCustomers: 125,
      totalProducts: 8,
      totalSales: 45,
      pendingServices: 12,
      serviceDue30Days: 8,
      overdueServices: 3
    });
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

  const alerts = [
    {
      type: 'warning',
      message: 'services are overdue',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/services?filter=overdue',
      count: 3
    },
    {
      type: 'info',
      message: 'services due in next 30 days',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/services?filter=due_30_days',
      count: 8
    },
    {
      type: 'success',
      message: 'services completed this month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/services?filter=completed_month',
      count: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        
        {/* Alerts & Notifications - Main Area */}
        <div className="mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Alerts & Notifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alerts.map((alert, index) => (
                <Link
                  key={index}
                  href={alert.href}
                  className={`flex flex-col p-6 ${alert.bgColor} rounded-xl border-2 border-transparent hover:border-gray-300 transition-all duration-200 hover:shadow-md cursor-pointer group`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className={`p-3 rounded-full ${alert.bgColor.replace('bg-', 'bg-').replace('-50', '-100')} group-hover:scale-110 transition-transform duration-200`}>
                      <alert.icon className={`w-6 h-6 ${alert.color}`} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{alert.count}</div>
                    <p className="text-sm font-medium text-gray-700">{alert.message}</p>
                  </div>
                </Link>
              ))}
            </div>
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
                    <p className="text-xs font-medium text-gray-600">Pending Services</p>
                    <p className="text-base font-bold text-gray-900">{stats.pendingServices}</p>
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
