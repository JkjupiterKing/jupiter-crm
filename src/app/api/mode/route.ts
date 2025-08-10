import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  try {
    return NextResponse.json({
      mode: config.database.isMockMode ? 'mock' : 'normal',
      databaseUrl: config.database.url,
      isMockMode: config.database.isMockMode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting mode info:', error);
    return NextResponse.json(
      { error: 'Failed to get mode information' },
      { status: 500 }
    );
  }
}
