import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const filterBy = searchParams.get('filterBy');
    const productId = searchParams.get('productId');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (filterBy === 'active') where.isActive = true;
    if (filterBy === 'inactive') where.isActive = false;
    if (filterBy === 'low-stock') where.stockQuantity = { lt: 10 };
    if (productId) where.productId = parseInt(productId, 10);

    const parts = await prisma.sparePart.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error fetching spare parts:', error);
    return NextResponse.json({ error: 'Failed to fetch spare parts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const part = await prisma.sparePart.create({
      data: {
        name: body.name,
        sku: body.sku,
        description: body.description,
        price: typeof body.price === 'number' ? body.price : body.price ? parseInt(body.price) : null,
        stockQuantity: body.stockQuantity || 0,
        isActive: body.isActive !== false,
        productId: body.productId ?? null,
      },
    });
    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    console.error('Error creating spare part:', error);
    return NextResponse.json({ error: 'Failed to create spare part' }, { status: 500 });
  }
}


