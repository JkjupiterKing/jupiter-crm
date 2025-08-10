import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get total counts
    const [
      totalCustomers,
      totalProducts,
      totalSales,
      totalServiceRequests,
      pendingServices,
      serviceDue30Days,
      overdueServices,
      completedServicesThisMonth,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.sale.count(),
      prisma.serviceJob.count(),
      prisma.serviceJob.count({
        where: { status: 'PLANNED' },
      }),
      prisma.serviceJob.count({
        where: {
          status: 'PLANNED',
          scheduledDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        },
      }),
      prisma.serviceJob.count({
        where: {
          status: 'PLANNED',
          scheduledDate: {
            lt: new Date(),
          },
        },
      }),
      prisma.serviceJob.count({
        where: {
          status: 'COMPLETED',
          scheduledDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
          },
        },
      }),
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
        scheduledDate: 'desc',
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
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todaysServices = await prisma.serviceJob.findMany({
      where: {
        scheduledDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        customer: true,
        engineer: true,
      },
      orderBy: {
        scheduledDate: 'asc',
      },
    });

    return NextResponse.json({
      stats: {
        totalCustomers,
        totalProducts,
        totalSales,
        totalServiceRequests,
        pendingServices,
        serviceDue30Days,
        overdueServices,
        completedServicesThisMonth,
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
