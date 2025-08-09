import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) return notFound();
  // TODO: Implement form and update logic
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Sale</h1>
      <div className="bg-white rounded shadow p-6">
        <p>Edit form goes here.</p>
      </div>
    </div>
  );
}
