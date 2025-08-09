import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const part = await prisma.sparePart.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!part) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(part);
  } catch (error) {
    console.error('Error fetching spare part:', error);
    return NextResponse.json({ error: 'Failed to fetch spare part' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const part = await prisma.sparePart.update({
      where: { id },
      data: {
        name: body.name,
        sku: body.sku,
        description: body.description,
        price: typeof body.price === 'number' ? body.price : body.price ? parseInt(body.price) : null,
        stockQuantity: body.stockQuantity,
        isActive: body.isActive,
        productId: body.productId ?? null,
      },
    });
    return NextResponse.json(part);
  } catch (error) {
    console.error('Error updating spare part:', error);
    return NextResponse.json({ error: 'Failed to update spare part' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.sparePart.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting spare part:', error);
    return NextResponse.json({ error: 'Failed to delete spare part' }, { status: 500 });
  }
}


