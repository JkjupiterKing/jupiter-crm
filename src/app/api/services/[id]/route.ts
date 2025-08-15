import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ServiceDueStatus, ServiceVisitStatus } from '@prisma/client';

interface ServiceItemData {
  productId?: number;
  sparePartId?: number;
  quantity: number;
  unitPrice: number;
  coveredByWarranty: boolean;
}

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

    const dataToUpdate: { [key: string]: string | number | Date | null | undefined | { deleteMany: {}; create: ServiceItemData[]; } } = {};

    // Direct field updates
    if (body.customerId) dataToUpdate.customerId = body.customerId;
    if (body.customerProductId) dataToUpdate.customerProductId = body.customerProductId;
    if (body.jobType) dataToUpdate.jobType = body.jobType;
    if (body.warrantyStatus) dataToUpdate.warrantyStatus = body.warrantyStatus;
    if (body.engineerId) dataToUpdate.engineerId = body.engineerId;
    if (body.problemDescription) dataToUpdate.problemDescription = body.problemDescription;
    if (body.resolutionNotes) dataToUpdate.resolutionNotes = body.resolutionNotes;
    if (typeof body.billedAmount === 'number') {
      dataToUpdate.billedAmount = body.billedAmount;
    }

    // Handle date and status updates
    if (body.visitScheduledDate) {
      dataToUpdate.visitScheduledDate = new Date(body.visitScheduledDate);
    }
    if (body.serviceDueDate) {
      dataToUpdate.serviceDueDate = new Date(body.serviceDueDate);
    }

    // Handle visit status - manual override takes precedence
    if (body.serviceVisitStatus && Object.values(ServiceVisitStatus).includes(body.serviceVisitStatus)) {
      dataToUpdate.serviceVisitStatus = body.serviceVisitStatus;
    } else if (body.visitScheduledDate) {
      // If date is changed, recalculate status if not manually set
      dataToUpdate.serviceVisitStatus = ServiceVisitStatus.PLANNED;
    } else if (body.visitScheduledDate === null) {
      dataToUpdate.serviceVisitStatus = ServiceVisitStatus.UNSCHEDULED;
    }

    // Determine final due status. This must come after visit status is determined.
    if (
      dataToUpdate.serviceVisitStatus === ServiceVisitStatus.COMPLETED ||
      dataToUpdate.serviceVisitStatus === ServiceVisitStatus.CANCELLED
    ) {
      dataToUpdate.serviceDueStatus = null;
    } else if (dataToUpdate.serviceDueDate) {
      // If due date is provided, calculate due status
      dataToUpdate.serviceDueStatus = (dataToUpdate.serviceDueDate as Date) < new Date() ? ServiceDueStatus.OVERDUE : ServiceDueStatus.DUE;
    } else if (body.serviceDueDate === null) {
      // If due date is explicitly set to null
      dataToUpdate.serviceDueStatus = null;
    }

    // Handle items update
    if (Array.isArray(body.items)) {
      dataToUpdate.items = {
        deleteMany: {},
        create: body.items.map((item: ServiceItemData) => ({
          productId: item.productId,
          sparePartId: item.sparePartId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          coveredByWarranty: !!item.coveredByWarranty,
        })),
      };
    }

    const job = await prisma.serviceJob.update({
      where: { id },
      data: dataToUpdate,
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


