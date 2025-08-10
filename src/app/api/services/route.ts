import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const filterBy = searchParams.get('filterBy');

    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { engineer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (filterBy === 'planned') {
      whereClause.status = 'PLANNED';
    } else if (filterBy === 'completed') {
      whereClause.status = 'COMPLETED';
    } else if (filterBy === 'cancelled') {
      whereClause.status = 'CANCELLED';
    } else if (filterBy === 'no_show') {
      whereClause.status = 'NO_SHOW';
    } else if (filterBy === 'today') {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      whereClause.scheduledDate = {
        gte: startOfDay,
        lt: endOfDay,
      };
    } else if (filterBy === 'overdue') {
      const today = new Date();
      whereClause.AND = [
        { scheduledDate: { lt: today } },
        { status: 'PLANNED' },
      ];
    } else if (filterBy === 'due_30_days') {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      whereClause.AND = [
        { scheduledDate: { gte: today, lte: thirtyDaysFromNow } },
        { status: 'PLANNED' },
      ];
    } else if (filterBy === 'completed_month') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      whereClause.AND = [
        { scheduledDate: { gte: startOfMonth } },
        { status: 'COMPLETED' },
      ];
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
        scheduledDate: 'asc',
      },
    });

    return NextResponse.json(services);
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
    
    const service = await prisma.serviceJob.create({
      data: {
        customerId: body.customerId,
        customerProductId: body.customerProductId,
        scheduledDate: new Date(body.scheduledDate),
        status: body.status || 'PLANNED',
        jobType: body.jobType,
        warrantyStatus: body.warrantyStatus,
        engineerId: body.engineerId,
        saleId: body.saleId,
        problemDescription: body.problemDescription,
        resolutionNotes: body.resolutionNotes,
        billedAmount: body.billedAmount ? parseInt(body.billedAmount) : null,
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
