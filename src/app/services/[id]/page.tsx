import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const service = await prisma.serviceJob.findUnique({ where: { id } });
  if (!service) return notFound();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Service Details</h1>
      <div className="bg-white rounded shadow p-6">
        <div><b>ID:</b> {service.id}</div>
        <div><b>Scheduled Date:</b> {service.scheduledDate.toLocaleString()}</div>
        <div><b>Status:</b> {service.status}</div>
        <div><b>Job Type:</b> {service.jobType}</div>
        <div><b>Warranty Status:</b> {service.warrantyStatus}</div>
        <div><b>Problem Description:</b> {service.problemDescription || 'N/A'}</div>
        <div><b>Resolution Notes:</b> {service.resolutionNotes || 'N/A'}</div>
        <div><b>Billed Amount:</b> {service.billedAmount || 'N/A'}</div>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
