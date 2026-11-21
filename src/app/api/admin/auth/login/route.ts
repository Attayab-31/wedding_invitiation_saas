import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  adminSessionCookie,
  createAdminSessionToken,
  getAdminAuthSetupError,
  isSameOriginRequest,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from '@/lib/security/admin-auth';

const LoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(256),
});

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Request origin is not allowed.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: getAdminAuthSetupError() },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid login request.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const credentials = LoginSchema.safeParse(body);
  if (!credentials.success) {
    return NextResponse.json(
      { success: false, error: 'Enter a valid email address and password.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!verifyAdminCredentials(credentials.data.email, credentials.data.password)) {
    return NextResponse.json(
      { success: false, error: 'Email or password is incorrect.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const response = NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store' } }
  );
  response.cookies.set({
    name: adminSessionCookie.name,
    value: createAdminSessionToken(),
    httpOnly: adminSessionCookie.options.httpOnly,
    secure: adminSessionCookie.options.secure,
    sameSite: adminSessionCookie.options.sameSite,
    path: adminSessionCookie.options.path,
    maxAge: adminSessionCookie.maxAge,
  });
  return response;
}
