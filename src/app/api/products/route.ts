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
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filterBy === 'in_stock') {
      whereClause.currentStock = { gt: 0 };
    } else if (filterBy === 'low_stock') {
      whereClause.currentStock = { lte: 10 };
    } else if (filterBy === 'out_of_stock') {
      whereClause.currentStock = 0;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            inventoryTxns: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      unitPrice: product.unitPrice,
      costPrice: product.costPrice,
      description: product.description,
      manufacturer: product.manufacturer,
      model: product.model,
      warrantyPeriod: product.warrantyPeriod,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      transactionCount: product._count.inventoryTxns,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      sku,
      category,
      currentStock,
      reorderLevel,
      unitPrice,
      costPrice,
      description,
      manufacturer,
      model,
      warrantyPeriod,
      isActive = true,
      service_frequency,
    } = body;

    // Validate required fields
    if (!name || !sku || !category) {
      return NextResponse.json(
        { error: 'Name, SKU, and category are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findFirst({
      where: { sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        currentStock: currentStock || 0,
        reorderLevel: reorderLevel || 0,
        unitPrice: unitPrice || 0,
        costPrice: costPrice || 0,
        description: description || '',
        manufacturer: manufacturer || '',
        model: model || '',
        warrantyPeriod: warrantyPeriod || 0,
        isActive,
        service_frequency: service_frequency || 'NONE',
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
