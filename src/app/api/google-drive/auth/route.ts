import { NextResponse } from 'next/server';
import { generateAuthUrl } from '@/app/lib/googleDrive';

export async function GET() {
  const url = generateAuthUrl();
  return NextResponse.json({ url });
}
