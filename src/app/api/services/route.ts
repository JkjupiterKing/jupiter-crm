import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

import { ServiceDueStatus, ServiceVisitStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const dueStatus = searchParams.get('due_status');
    const visitStatus = searchParams.get('visit_status');

    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { engineer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (dueStatus && Object.values(ServiceDueStatus).includes(dueStatus as ServiceDueStatus)) {
      whereClause.serviceDueStatus = dueStatus;
    }

    if (visitStatus && Object.values(ServiceVisitStatus).includes(visitStatus as ServiceVisitStatus)) {
      whereClause.serviceVisitStatus = visitStatus;
    }

    const services = await prisma.serviceJob.findMany({
      where: whereClause,
      include: {
        customer: true,
        customerProduct: {
          include: {
            product: true,
          },
        },
        engineer: true,
        items: {
          include: {
            product: true,
            sparePart: true,
          },
        },
      },
      orderBy: {
        visitScheduledDate: 'asc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let serviceDueDate;

    if (body.saleId) {
      const sale = await prisma.sale.findUnique({
        where: { id: body.saleId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (sale) {
        const productItem = sale.items.find(item => item.product?.service_frequency && item.product.service_frequency !== 'NONE');
        if (productItem && productItem.product) {
          const frequency = productItem.product.service_frequency;
          const saleDate = new Date(sale.saleDate);
          if (frequency === 'QUARTERLY') {
            serviceDueDate = new Date(saleDate.setMonth(saleDate.getMonth() + 3));
          } else if (frequency === 'HALF_YEARLY') {
            serviceDueDate = new Date(saleDate.setMonth(saleDate.getMonth() + 6));
          } else if (frequency === 'YEARLY') {
            serviceDueDate = new Date(saleDate.setFullYear(saleDate.getFullYear() + 1));
          }
        }
      }
    }
    
    if (!serviceDueDate) {
      if (body.serviceDueDate) {
        serviceDueDate = new Date(body.serviceDueDate);
      } else {
        return NextResponse.json({ error: 'Service Due Date is required' }, { status: 400 });
      }
    }

    const visitScheduledDate = body.visitScheduledDate ? new Date(body.visitScheduledDate) : null;

    // Determine statuses
    const serviceVisitStatus = visitScheduledDate ? ServiceVisitStatus.PLANNED : ServiceVisitStatus.UNSCHEDULED;
    const serviceDueStatus = serviceDueDate < new Date() ? ServiceDueStatus.OVERDUE : ServiceDueStatus.DUE;

    const service = await prisma.serviceJob.create({
      data: {
        customerId: body.customerId,
        customerProductId: body.customerProductId,
        visitScheduledDate: visitScheduledDate,
        serviceDueDate: serviceDueDate,
        serviceDueStatus: serviceDueStatus,
        serviceVisitStatus: serviceVisitStatus,
        jobType: body.jobType,
        warrantyStatus: body.warrantyStatus,
        engineerId: body.engineerId,
        saleId: body.saleId,
        problemDescription: body.problemDescription,
        resolutionNotes: body.resolutionNotes,
        billedAmount: body.billedAmount ? parseInt(body.billedAmount) : null,
        items: {
          create: body.items?.map((item: any) => ({
            productId: item.productId,
            sparePartId: item.sparePartId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            coveredByWarranty: item.coveredByWarranty || false,
          })) || [],
        },
      },
      include: {
        customer: true,
        customerProduct: {
          include: {
            product: true,
          },
        },
        engineer: true,
        items: {
          include: {
            product: true,
            sparePart: true,
          },
        },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
