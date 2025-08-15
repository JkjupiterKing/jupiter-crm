import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ServiceVisitStatus } from '@prisma/client';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const services = await prisma.serviceJob.findMany({
      where: {
        serviceVisitStatus: {
          notIn: [ServiceVisitStatus.COMPLETED, ServiceVisitStatus.CANCELLED],
        },
      },
      select: {
        serviceDueDate: true,
      },
    });

    const servicesOverdue = services.filter(
      (service) => new Date(service.serviceDueDate) < today
    ).length;

    const [
      servicesDueInNext30Days,
      servicesPlanned,
    ] = await Promise.all([
      prisma.serviceJob.count({
        where: {
          serviceDueDate: {
            gte: today,
            lte: thirtyDaysFromNow,
          },
          serviceVisitStatus: {
            notIn: [ServiceVisitStatus.COMPLETED, ServiceVisitStatus.CANCELLED],
          },
        },
      }),
      prisma.serviceJob.count({
        where: {
          serviceVisitStatus: 'PLANNED',
        },
      }),
    ]);

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
