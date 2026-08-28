import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase/db';

export async function GET() {
  const status = await testSupabaseConnection();
  return NextResponse.json({
    ...status,
    timestamp: new Date().toISOString(),
  });
}
