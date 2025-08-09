import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function SaleDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) return notFound();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Sale Details</h1>
      <div className="bg-white rounded shadow p-6">
  <div><b>ID:</b> {sale.id}</div>
  <div><b>Invoice Number:</b> {sale.invoiceNumber}</div>
  <div><b>Date:</b> {sale.date.toLocaleString()}</div>
  <div><b>Total:</b> {sale.total}</div>
  <div><b>Payment Mode:</b> {sale.paymentMode || 'N/A'}</div>
  <div><b>Notes:</b> {sale.notes || 'N/A'}</div>
  {/* Add more fields as needed */}
      </div>
    </div>
  );
}
