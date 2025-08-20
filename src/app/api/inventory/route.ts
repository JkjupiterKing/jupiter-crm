import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { dateOnly } from '@/lib/date-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('itemType'); // PRODUCT | SPARE_PART
    const productId = searchParams.get('productId');
    const sparePartId = searchParams.get('sparePartId');

    const where: any = {};
    if (itemType) where.itemType = itemType as any;
    if (productId) where.productId = parseInt(productId, 10);
    if (sparePartId) where.sparePartId = parseInt(sparePartId, 10);

    const txns = await prisma.inventoryTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(txns);
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const txn = await prisma.inventoryTransaction.create({
      data: {
        itemType: body.itemType,
        productId: body.productId ?? null,
        sparePartId: body.sparePartId ?? null,
        quantity: body.quantity,
        transactionKind: body.transactionKind || body.kind,
        note: body.note,
        notes: body.notes || body.note,
        unitPrice: body.unitPrice,
        totalAmount: body.totalAmount,
        transactionDate: dateOnly(body.transactionDate || new Date()),
      },
    });

    // Adjust stock counts for convenience
    if (body.itemType === 'PRODUCT' && body.productId) {
      const product = await prisma.product.findUnique({ where: { id: body.productId } });
      if (product) {
        const newQty = product.currentStock + (body.transactionKind === 'RETURN' || body.transactionKind === 'PURCHASE' || body.transactionKind === 'ADJUSTMENT' ? body.quantity : -body.quantity);
        await prisma.product.update({ where: { id: body.productId }, data: { currentStock: newQty } });
      }
    }
    if (body.itemType === 'SPARE_PART' && body.sparePartId) {
      const part = await prisma.sparePart.findUnique({ where: { id: body.sparePartId } });
      if (part) {
        const newQty = part.stockQuantity + (body.transactionKind === 'RETURN' || body.transactionKind === 'PURCHASE' || body.transactionKind === 'ADJUSTMENT' ? body.quantity : -body.quantity);
        await prisma.sparePart.update({ where: { id: body.sparePartId }, data: { stockQuantity: newQty } });
      }
    }

    return NextResponse.json(txn, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory transaction:', error);
    return NextResponse.json({ error: 'Failed to create inventory transaction' }, { status: 500 });
  }
}


