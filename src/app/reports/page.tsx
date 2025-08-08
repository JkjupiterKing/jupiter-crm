'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  Wrench,
  Download,
  Calendar
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sales');

  const reports = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Monthly sales analysis and revenue trends',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      id: 'customers',
      name: 'Customer Report',
      description: 'Customer database analysis and demographics',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels and inventory movement',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      id: 'services',
      name: 'Service Report',
      description: 'Service performance and engineer productivity',
      icon: Wrench,
      color: 'bg-orange-500'
    },
    {
      id: 'warranty',
      name: 'Warranty Report',
      description: 'Warranty status and service due analysis',
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Revenue analysis and financial performance',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view business reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Selection */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Reports</h2>
              <div className="space-y-4">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${report.color} bg-opacity-10`}>
                        <report.icon className={`w-5 h-5 ${report.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {reports.find(r => r.id === selectedReport)?.name}
                </h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Placeholder content for different reports */}
                {selectedReport === 'sales' && (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Report</h3>
                    <p className="text-gray-600 mb-4">
                      View monthly sales trends, revenue analysis, and performance metrics.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹45,000</div>
                        <div className="text-sm text-gray-600">This Month</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">12</div>
                        <div className="text-sm text-gray-600">Total Sales</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹3,750</div>
                        <div className="text-sm text-gray-600">Average Sale</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'customers' && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Report</h3>
                    <p className="text-gray-600 mb-4">
                      Analyze customer demographics, warranty status, and service history.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">125</div>
                        <div className="text-sm text-gray-600">Total Customers</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">85</div>
                        <div className="text-sm text-gray-600">In Warranty</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">40</div>
                        <div className="text-sm text-gray-600">Out of Warranty</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'inventory' && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory Report</h3>
                    <p className="text-gray-600 mb-4">
                      Track stock levels, low inventory alerts, and inventory movement.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">8</div>
                        <div className="text-sm text-gray-600">Total Products</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">3</div>
                        <div className="text-sm text-gray-600">Low Stock Items</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹25,000</div>
                        <div className="text-sm text-gray-600">Inventory Value</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'services' && (
                  <div className="text-center py-12">
                    <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Service Report</h3>
                    <p className="text-gray-600 mb-4">
                      Monitor service performance, engineer productivity, and completion rates.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">12</div>
                        <div className="text-sm text-gray-600">Pending Services</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">3</div>
                        <div className="text-sm text-gray-600">Overdue Services</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">85%</div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'warranty' && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Warranty Report</h3>
                    <p className="text-gray-600 mb-4">
                      Track warranty status, service due dates, and contract renewals.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">8</div>
                        <div className="text-sm text-gray-600">Due in 30 Days</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">3</div>
                        <div className="text-sm text-gray-600">Overdue</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">45</div>
                        <div className="text-sm text-gray-600">Active Contracts</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'revenue' && (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Report</h3>
                    <p className="text-gray-600 mb-4">
                      Analyze revenue trends, profit margins, and financial performance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹45,000</div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">25%</div>
                        <div className="text-sm text-gray-600">Profit Margin</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">₹11,250</div>
                        <div className="text-sm text-gray-600">Monthly Profit</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
