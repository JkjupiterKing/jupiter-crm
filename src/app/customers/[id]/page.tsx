import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Edit, User, Building, MapPin, Phone, Mail, Star, CheckCircle, XCircle } from 'lucide-react';
import { toYYYYMMDD } from '@/lib/date-utils';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  
  const customer = await prisma.customer.findUnique({ 
    where: { id },
    include: {
      products: {
        include: { product: true }
      },
      sales: true,
      serviceJobs: true,
      contracts: true
    }
  });
  
  if (!customer) return notFound();

  const address = [customer.address, customer.street, customer.city, customer.state, customer.pincode]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/customers" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{customer.fullName}</h1>
                <p className="text-gray-600">Customer Details</p>
              </div>
            </div>
            <Link 
              href={`/customers/${customer.id}/edit`} 
              className="btn-primary flex items-center space-x-2"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Customer</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">{customer.fullName}</p>
                </div>
                {customer.companyName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900 flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {customer.companyName}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center">
                    {customer.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                {customer.isVIP && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">VIP Status</label>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-600 font-medium">VIP Customer</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile</label>
                  <p className="text-gray-900">{customer.mobile}</p>
                </div>
                {customer.altMobile && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Alternative Mobile</label>
                    <p className="text-gray-900">{customer.altMobile}</p>
                  </div>
                )}
                {customer.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {customer.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {address && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address
                </h2>
                <p className="text-gray-900">{address}</p>
              </div>
            )}

            {/* Notes */}
            {customer.notes && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-gray-900">{customer.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Statistics */}
          <div className="space-y-6">
            {/* Activity Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Products</span>
                  <span className="font-semibold text-gray-900">{customer.products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-semibold text-gray-900">{customer.sales.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold text-gray-900">{customer.serviceJobs.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contracts</span>
                  <span className="font-semibold text-gray-900">{customer.contracts.length}</span>
                </div>
              </div>
            </div>

            {/* Customer Since */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Since</h3>
              <p className="text-gray-900">
                {toYYYYMMDD(new Date(customer.createdAt))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
