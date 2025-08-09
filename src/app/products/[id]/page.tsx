import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Product Details</h1>
      <div className="bg-white rounded shadow p-6">
  <div><b>Name:</b> {product.name}</div>
  <div><b>Category:</b> {product.category || 'N/A'}</div>
  <div><b>SKU:</b> {product.sku}</div>
  <div><b>Description:</b> {product.description}</div>
  <div><b>Price:</b> {product.price}</div>
  {/* Add more fields as needed */}
      </div>
    </div>
  );
}
