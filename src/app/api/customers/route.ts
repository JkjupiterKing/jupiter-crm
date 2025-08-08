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
        { fullName: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
        { doorNumber: { contains: search } },
        { area: { contains: search, mode: 'insensitive' } },
        { layout: { contains: search, mode: 'insensitive' } },
        { pinCode: { contains: search } },
        { district: { contains: search, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: {
        products: {
          include: {
            product: true,
            contracts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const customer = await prisma.customer.create({
      data: {
        fullName: body.fullName,
        doorNumber: body.doorNumber,
        street: body.street,
        area: body.area,
        layout: body.layout,
        district: body.district,
        pinCode: body.pinCode,
        mobile: body.mobile,
        altMobile: body.altMobile,
        email: body.email,
        notes: body.notes,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
