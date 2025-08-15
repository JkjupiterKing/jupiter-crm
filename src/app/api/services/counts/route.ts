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
      whereClause.serviceDueStatus = dueStatus as ServiceDueStatus;
    }

    if (visitStatus && Object.values(ServiceVisitStatus).includes(visitStatus as ServiceVisitStatus)) {
      whereClause.serviceVisitStatus = visitStatus as ServiceVisitStatus;
    }

    const totalServices = prisma.serviceJob.count({ where: whereClause });

    const dueServices = prisma.serviceJob.count({
      where: { ...whereClause, serviceDueStatus: 'DUE' },
    });

    const overdueServices = prisma.serviceJob.count({
      where: { ...whereClause, serviceDueStatus: 'OVERDUE' },
    });

    const unscheduledVisits = prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'UNSCHEDULED' },
    });

    const plannedVisits = prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'PLANNED' },
    });

    const completedVisits = prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'COMPLETED' },
    });

    const cancelledVisits = prisma.serviceJob.count({
      where: { ...whereClause, serviceVisitStatus: 'CANCELLED' },
    });

    const [
      total,
      due,
      overdue,
      unscheduled,
      planned,
      completed,
      cancelled,
    ] = await Promise.all([
      totalServices,
      dueServices,
      overdueServices,
      unscheduledVisits,
      plannedVisits,
      completedVisits,
      cancelledVisits,
    ]);

    return NextResponse.json({
      total,
      due,
      overdue,
      unscheduled,
      planned,
      completed,
      cancelled,
    });
  } catch (error) {
    console.error('Error fetching service counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service counts' },
      { status: 500 }
    );
  }
}
