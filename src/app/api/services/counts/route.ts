import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ServiceVisitStatus } from '@prisma/client';
import { dateOnly } from '@/lib/date-utils';

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
    const visitStatus = searchParams.get('visit_status');

    const whereClause: { [key: string]: unknown } = {
      serviceVisitStatus: {
        notIn: [ServiceVisitStatus.COMPLETED, ServiceVisitStatus.CANCELLED],
      },
    };

    if (search) {
      whereClause.OR = [
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { engineer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (visitStatus && Object.values(ServiceVisitStatus).includes(visitStatus as ServiceVisitStatus)) {
      whereClause.serviceVisitStatus = visitStatus as ServiceVisitStatus;
    }

    const services = await prisma.serviceJob.findMany({
      where: whereClause,
      select: {
        serviceDueDate: true,
        serviceVisitStatus: true,
      }
    });

    let due = 0;
    let overdue = 0;

    services.forEach(service => {
      const status = getServiceDueStatus(service.serviceDueDate);
      if (status === ServiceDueStatus.DUE) {
        due++;
      } else if (status === ServiceDueStatus.OVERDUE) {
        overdue++;
      }
    });

    const unscheduledVisits = await prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'UNSCHEDULED' },
    });

    const plannedVisits = await prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'PLANNED' },
    });

    return NextResponse.json({
      due,
      overdue,
      unscheduled: unscheduledVisits,
      planned: plannedVisits,
    });
  } catch (error) {
    console.error('Error fetching service counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service counts' },
      { status: 500 }
    );
  }
}
