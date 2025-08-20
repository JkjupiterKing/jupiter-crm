import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ServiceVisitStatus } from '@prisma/client';
import { dateOnly } from '@/lib/date-utils';
import { addDays, addMonths, addYears } from 'date-fns';

enum ServiceDueStatus {
  DUE = 'DUE',
  OVERDUE = 'OVERDUE',
}

const getServiceDueStatus = (serviceDueDate: Date): ServiceDueStatus | null => {
  const today = dateOnly(new Date());
  const dueDate = dateOnly(serviceDueDate);

  if (dueDate < today) {
    return ServiceDueStatus.OVERDUE;
  }
  return ServiceDueStatus.DUE;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const dueStatus = searchParams.get('due_status');
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

    // Special handling for the due_in_30_days filter
    if (filter === 'due_in_30_days') {
      const today = dateOnly(new Date());
      const thirtyDaysFromNow = addDays(today, 30);

      whereClause.serviceDueDate = {
        gte: today,
        lte: thirtyDaysFromNow,
      };
      
      // Exclude completed and cancelled services
      whereClause.serviceVisitStatus = {
        notIn: ['COMPLETED', 'CANCELLED']
      };
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
        serviceDueDate: 'asc',
      },
    });

    const servicesWithStatus = services.map(service => {
      let serviceDueStatus: ServiceDueStatus | null = null;
      if (service.serviceVisitStatus !== ServiceVisitStatus.COMPLETED && 
          service.serviceVisitStatus !== ServiceVisitStatus.CANCELLED) {
        serviceDueStatus = getServiceDueStatus(service.serviceDueDate);
      }
      return { ...service, serviceDueStatus };
    });

    let filteredServices = servicesWithStatus;
    if (dueStatus) {
      filteredServices = servicesWithStatus.filter(
        service => service.serviceDueStatus === dueStatus
      );
    }

    return NextResponse.json(filteredServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services', details: error instanceof Error ? error.message : 'Unknown error' },
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
          const saleDate = dateOnly(sale.saleDate);
          if (frequency === 'QUARTERLY') {
            serviceDueDate = addMonths(saleDate, 3);
          } else if (frequency === 'HALF_YEARLY') {
            serviceDueDate = addMonths(saleDate, 6);
          } else if (frequency === 'YEARLY') {
            serviceDueDate = addYears(saleDate, 1);
          }
        }
      }
    }
    
    if (!serviceDueDate) {
      if (body.serviceDueDate) {
        serviceDueDate = dateOnly(body.serviceDueDate);
      } else {
        return NextResponse.json({ error: 'Service Due Date is required' }, { status: 400 });
      }
    }

    const visitScheduledDate = body.visitScheduledDate ? dateOnly(body.visitScheduledDate) : null;

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
        notes: body.notes,
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