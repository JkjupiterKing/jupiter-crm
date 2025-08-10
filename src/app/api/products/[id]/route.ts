import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { spareParts: true },
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        sku: body.sku,
        description: body.description,
        currentStock: typeof body.currentStock === 'number' ? body.currentStock : body.currentStock ? parseInt(body.currentStock) : 0,
        reorderLevel: typeof body.reorderLevel === 'number' ? body.reorderLevel : body.reorderLevel ? parseInt(body.reorderLevel) : 0,
        unitPrice: typeof body.unitPrice === 'number' ? body.unitPrice : body.unitPrice ? parseInt(body.unitPrice) : null,
        costPrice: typeof body.costPrice === 'number' ? body.costPrice : body.costPrice ? parseInt(body.costPrice) : null,
        manufacturer: body.manufacturer,
        model: body.model,
        warrantyPeriod: typeof body.warrantyPeriod === 'number' ? body.warrantyPeriod : body.warrantyPeriod ? parseInt(body.warrantyPeriod) : 12,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}


