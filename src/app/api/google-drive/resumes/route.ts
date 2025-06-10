import { NextResponse } from 'next/server';
import { identifyResumeFiles } from '@/app/lib/googleDrive';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.tokens) {
    return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
  }
  const resumes = await identifyResumeFiles(body.tokens);
  return NextResponse.json({ resumes });
}
