import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const job = await prisma.serviceJob.findUnique({
      where: { id },
      include: {
        customer: true,
        customerProduct: { include: { product: true } },
        engineer: true,
        items: { include: { product: true, sparePart: true } },
      },
    });
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching service job:', error);
    return NextResponse.json({ error: 'Failed to fetch service job' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const job = await prisma.serviceJob.update({
      where: { id },
      data: {
        customerId: body.customerId,
        customerProductId: body.customerProductId,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        status: body.status,
        jobType: body.jobType,
        warrantyStatus: body.warrantyStatus,
        engineerId: body.engineerId,
        problemDescription: body.problemDescription,
        resolutionNotes: body.resolutionNotes,
        billedAmount: typeof body.billedAmount === 'number' ? body.billedAmount : body.billedAmount ? parseInt(body.billedAmount) : undefined,
        ...(Array.isArray(body.items)
          ? {
              items: {
                deleteMany: {},
                create: body.items.map((item: any) => ({
                  productId: item.productId,
                  sparePartId: item.sparePartId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  coveredByWarranty: !!item.coveredByWarranty,
                })),
              },
            }
          : {}),
      },
      include: {
        customer: true,
        customerProduct: { include: { product: true } },
        engineer: true,
        items: { include: { product: true, sparePart: true } },
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating service job:', error);
    return NextResponse.json({ error: 'Failed to update service job' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.serviceJob.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service job:', error);
    return NextResponse.json({ error: 'Failed to delete service job' }, { status: 500 });
  }
}


