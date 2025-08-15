import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ServiceVisitStatus } from '@prisma/client';

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
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const overdue = services.filter(
      (service) => new Date(service.serviceDueDate) < today
    ).length;

    const dueIn30Days = services.filter((service) => {
      const dueDate = new Date(service.serviceDueDate);
      return dueDate >= today && dueDate <= thirtyDaysFromNow;
    }).length;

    const unscheduledVisits = await prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'UNSCHEDULED' },
    });

    const plannedVisits = await prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'PLANNED' },
    });

    return NextResponse.json({
      dueIn30Days,
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
