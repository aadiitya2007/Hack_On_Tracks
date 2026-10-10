import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const userCount = await prisma.user.count().catch((e:any) => -1);
    const holdingCount = await prisma.holding.count().catch((e:any) => -1);
    const priceCount = await prisma.priceHistory.count().catch((e:any) => -1);
    
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      ML_SERVICE_URL: !!process.env.ML_SERVICE_URL,
      NEXT_PUBLIC_ML_URL: !!process.env.NEXT_PUBLIC_ML_URL,
    };

    // Test ML Service
    let mlStatus = 'unreachable';
    let mlResponse = '';
    try {
      const mlUrl = process.env.NEXT_PUBLIC_ML_URL || process.env.ML_SERVICE_URL || 'http://localhost:8000';
      const res = await fetch(`${mlUrl}/`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        mlStatus = 'ok';
        mlResponse = await res.text();
      } else {
        mlStatus = `error: ${res.status}`;
      }
    } catch (e: any) {
      mlStatus = `error or asleep: ${e.message}`;
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: userCount !== -1,
        rowCounts: { users: userCount, holdings: holdingCount, priceHistory: priceCount }
      },
      mlService: { status: mlStatus, response: mlResponse },
      environment: envVars
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
