import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookie, isSameOriginRequest } from '@/lib/security/admin-auth';

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Request origin is not allowed.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const response = NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store' } }
  );
  response.cookies.set({
    name: adminSessionCookie.name,
    value: '',
    httpOnly: adminSessionCookie.options.httpOnly,
    secure: adminSessionCookie.options.secure,
    sameSite: adminSessionCookie.options.sameSite,
    path: adminSessionCookie.options.path,
    maxAge: 0,
  });
  return response;
}
