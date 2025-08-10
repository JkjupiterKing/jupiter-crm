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
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filterBy === 'active') {
      whereClause.isActive = true;
    } else if (filterBy === 'inactive') {
      whereClause.isActive = false;
    } else if (filterBy === 'vip') {
      whereClause.isVIP = true;
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            sales: true,
            serviceJobs: true,
            contracts: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });

    const transformedCustomers = customers.map(customer => ({
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.mobile,
      altMobile: customer.altMobile,
      companyName: customer.companyName,
      address: customer.address,
      street: customer.street,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      isVIP: customer.isVIP,
      isActive: customer.isActive,
      notes: customer.notes,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      salesCount: customer._count.sales,
      serviceCount: customer._count.serviceJobs,
      contractCount: customer._count.contracts,
    }));

    return NextResponse.json(transformedCustomers);
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
    
    const {
      fullName,
      email,
      mobile,
      altMobile,
      companyName,
      address,
      street,
      city,
      state,
      pincode,
      isVIP = false,
      isActive = true,
      notes,
    } = body;

    // Validate required fields
    if (!fullName || !mobile) {
      return NextResponse.json(
        { error: 'Full name and mobile are required' },
        { status: 400 }
      );
    }

    // Check if mobile already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: { mobile },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Mobile number already exists' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        fullName,
        email: email || '',
        mobile,
        altMobile: altMobile || '',
        companyName: companyName || '',
        address: address || '',
        street: street || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        isVIP,
        isActive,
        notes: notes || '',
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
