import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function SparePartDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const part = await prisma.sparePart.findUnique({ where: { id } });
  if (!part) return notFound();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Spare Part Details</h1>
      <div className="bg-white rounded shadow p-6">
        <div><b>Name:</b> {part.name}</div>
        <div><b>SKU:</b> {part.sku}</div>
        <div><b>Description:</b> {part.description}</div>
        <div><b>Price:</b> {part.price}</div>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
