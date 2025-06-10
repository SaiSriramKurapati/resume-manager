import { NextResponse } from 'next/server';
import { getTokens } from '@/app/lib/googleDrive';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  const tokens = await getTokens(code);
  return NextResponse.json({ tokens });
}
