import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { dateOnly } from '@/lib/date-utils';
import { addDays } from 'date-fns';

export async function GET() {
  try {
    // Get total counts
    const [
      totalCustomers,
      totalProducts,
      totalSales,
      totalServiceRequests
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.sale.count(),
      prisma.serviceJob.count()
    ]);

    // Get recent activities
    const recentSales = await prisma.sale.findMany({
      take: 5,
      include: {
        customer: true,
      },
      orderBy: {
        saleDate: 'desc',
      },
    });

    const recentServices = await prisma.serviceJob.findMany({
      take: 5,
      include: {
        customer: true,
        engineer: true,
      },
      orderBy: {
        visitScheduledDate: 'desc',
      },
    });

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        currentStock: {
          lt: 10,
        },
        isActive: true,
      },
      take: 5,
      orderBy: {
        currentStock: 'asc',
      },
    });

    // Get today's services
    const startOfDay = dateOnly(new Date());
    const endOfDay = addDays(startOfDay, 1);

    const todaysServices = await prisma.serviceJob.findMany({
      where: {
        visitScheduledDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        customer: true,
        engineer: true,
      },
      orderBy: {
        visitScheduledDate: 'asc',
      },
    });

    return NextResponse.json({
      stats: {
        totalCustomers,
        totalProducts,
        totalSales,
        totalServiceRequests
      },
      recentSales,
      recentServices,
      lowStockProducts,
      todaysServices,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
