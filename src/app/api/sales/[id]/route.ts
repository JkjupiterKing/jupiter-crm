import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true, sparePart: true } },
      },
    });
    if (!sale) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        customerId: body.customerId,
        invoiceNumber: body.invoiceNumber,
        saleDate: body.saleDate ? new Date(body.saleDate) : undefined,
        totalAmount: body.totalAmount,
        paymentMode: body.paymentMode,
        notes: body.notes,
        // Items patching (simple approach: delete and recreate if provided)
        ...(Array.isArray(body.items)
          ? {
              items: {
                deleteMany: {},
                create: body.items.map((item: any) => ({
                  itemType: item.itemType,
                  productId: item.productId,
                  sparePartId: item.sparePartId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  lineTotal: item.lineTotal,
                })),
              },
            }
          : {}),
      },
      include: { customer: true, items: { include: { product: true, sparePart: true } } },
    });
    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.sale.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
  }
}


