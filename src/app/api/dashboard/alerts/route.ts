import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const [
      servicesDueInNext30Days,
      servicesOverdue,
      servicesPlanned,
    ] = await Promise.all([
      prisma.serviceJob.count({
        where: {
          serviceDueDate: {
            gte: today,
            lte: thirtyDaysFromNow,
          },
        },
      }),
      prisma.serviceJob.count({
        where: {
          serviceDueStatus: 'OVERDUE',
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
