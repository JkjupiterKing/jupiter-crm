import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const engineers = await prisma.engineer.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(engineers);
  } catch (error) {
    console.error('Error fetching engineers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engineers' },
      { status: 500 }
    );
  }
}
