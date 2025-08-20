import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ServiceVisitStatus } from '@prisma/client';
import { dateOnly } from '@/lib/date-utils';
import { addDays } from 'date-fns';

export async function GET() {
  try {
    const today = dateOnly(new Date());
    const thirtyDaysFromNow = addDays(today, 30);

    const servicesOverdue = await prisma.serviceJob.count({
      where: {
        serviceDueDate: {
          lt: today,
        },
        serviceVisitStatus: {
          notIn: [ServiceVisitStatus.COMPLETED, ServiceVisitStatus.CANCELLED],
        },
      },
    });

    const servicesDueInNext30Days = await prisma.serviceJob.count({
      where: {
        serviceDueDate: {
          gte: today,
          lte: thirtyDaysFromNow,
        },
        serviceVisitStatus: {
          notIn: [ServiceVisitStatus.COMPLETED, ServiceVisitStatus.CANCELLED],
        },
      },
    });

    const servicesPlanned = await prisma.serviceJob.count({
      where: {
        serviceVisitStatus: 'PLANNED',
      },
    });

    return NextResponse.json({
      servicesDueInNext30Days,
      servicesOverdue,
      servicesPlanned,
    });
  } catch (error) {
    console.error('Error fetching dashboard alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard alerts' },
      { status: 500 }
    );
  }
}
