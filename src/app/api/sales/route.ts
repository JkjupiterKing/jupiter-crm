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
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { paymentMode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filterBy === 'paid') {
      whereClause.status = 'PAID';
    } else if (filterBy === 'pending') {
      whereClause.status = 'PENDING';
    } else if (filterBy === 'cancelled') {
      whereClause.status = 'CANCELLED';
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            sparePart: true,
          },
        },
      },
      orderBy: {
        saleDate: 'desc',
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const sale = await prisma.sale.create({
      data: {
        customerId: body.customerId,
        invoiceNumber: body.invoiceNumber,
        saleDate: new Date(body.saleDate),
        totalAmount: body.totalAmount,
        paymentMode: body.paymentMode,
        status: body.status || 'PAID',
        notes: body.notes,
        items: {
          create: body.items.map((item: any) => ({
            itemType: item.itemType,
            productId: item.productId,
            sparePartId: item.sparePartId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            sparePart: true,
          },
        },
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
