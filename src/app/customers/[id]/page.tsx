import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return notFound();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Customer Details</h1>
      <div className="bg-white rounded shadow p-6">
        <div><b>Name:</b> {customer.fullName}</div>
        <div><b>Email:</b> {customer.email || 'N/A'}</div>
        <div><b>Mobile:</b> {customer.mobile}</div>
        <div><b>Alt Mobile:</b> {customer.altMobile || 'N/A'}</div>
        <div><b>Address:</b> {[
          customer.doorNumber,
          customer.street,
          customer.area,
          customer.layout,
          customer.district,
          customer.pinCode
        ].filter(Boolean).join(', ') || 'N/A'}</div>
        <div><b>Notes:</b> {customer.notes || 'N/A'}</div>
      </div>
    </div>
  );
}
