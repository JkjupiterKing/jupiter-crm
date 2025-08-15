import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

import { ServiceVisitStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const visitStatus = searchParams.get('visit_status');
    const filter = searchParams.get('filter');

    const whereClause: { [key: string]: unknown } = {};

    if (search) {
      whereClause.OR = [
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { engineer: { name: { contains: search, mode: 'insensitive' } } },
      ];
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

    let filteredServices = services;

    if (filter === 'due_in_30_days') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      filteredServices = services.filter((service) => {
        const dueDate = new Date(service.serviceDueDate);
        return dueDate >= today && dueDate <= thirtyDaysFromNow;
      });
    }

    return NextResponse.json(filteredServices);
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
    let serviceVisitStatus = body.serviceVisitStatus;
    if (!serviceVisitStatus || !Object.values(ServiceVisitStatus).includes(serviceVisitStatus)) {
      serviceVisitStatus = visitScheduledDate ? ServiceVisitStatus.PLANNED : ServiceVisitStatus.UNSCHEDULED;
    }

    const service = await prisma.serviceJob.create({
      data: {
        customerId: body.customerId,
        customerProductId: body.customerProductId,
        visitScheduledDate: visitScheduledDate,
        serviceDueDate: serviceDueDate,
        serviceVisitStatus: serviceVisitStatus,
        jobType: body.jobType,
        warrantyStatus: body.warrantyStatus,
        engineerId: body.engineerId,
        saleId: body.saleId,
        problemDescription: body.problemDescription,
        resolutionNotes: body.resolutionNotes,
        billedAmount: body.billedAmount ? parseInt(body.billedAmount) : null,
        items: {
        create: body.items?.map((item: { productId: any; sparePartId: any; quantity: any; unitPrice: any; coveredByWarranty: any; }) => ({
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
