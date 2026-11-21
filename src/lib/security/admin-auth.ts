import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

const ADMIN_SESSION_COOKIE = 'wedding_admin_session';
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 4;

interface AdminAuthConfig {
  email: string;
  password: string;
  sessionSecret: string;
}

interface AdminSessionPayload {
  sub: 'admin';
  exp: number;
}

function getAdminAuthConfig(): AdminAuthConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? '';
  const password = process.env.ADMIN_PASSWORD ?? '';
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? '';

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 20 ||
    sessionSecret.length < 32
  ) {
    return null;
  }

  return { email, password, sessionSecret };
}

function constantTimeEqual(left: string, right: string) {
  const leftDigest = createHmac('sha256', 'admin-credential-comparison').update(left).digest();
  const rightDigest = createHmac('sha256', 'admin-credential-comparison').update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function isAdminAuthConfigured() {
  return getAdminAuthConfig() !== null;
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = getAdminAuthConfig();
  if (!config) return false;

  return (
    constantTimeEqual(email.trim().toLowerCase(), config.email) &&
    constantTimeEqual(password, config.password)
  );
}

export function createAdminSessionToken() {
  const config = getAdminAuthConfig();
  if (!config) throw new Error('Admin authentication is not configured.');

  const payload: AdminSessionPayload = {
    sub: 'admin',
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', config.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyAdminSessionToken(token: string | undefined): boolean {
  const config = getAdminAuthConfig();
  if (!config || !token) return false;

  const [encodedPayload, signature, extra] = token.split('.');
  if (!encodedPayload || !signature || extra !== undefined) return false;

  const expectedSignature = createHmac('sha256', config.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');
  if (!constantTimeEqual(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as Partial<AdminSessionPayload>;

    return (
      payload.sub === 'admin' &&
      typeof payload.exp === 'number' &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token) ? { role: 'owner' as const } : null;
}

export async function requireAdminPage() {
  if (!(await getAdminSession())) redirect('/admin/login');
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function authorizeAdminApi(request: Request) {
  if (
    ['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method.toUpperCase()) &&
    !isSameOriginRequest(request)
  ) {
    return NextResponse.json(
      { success: false, error: 'Request origin is not allowed.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!(await getAdminSession())) {
    return NextResponse.json(
      { success: false, error: 'Authentication required.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return null;
}

export const adminSessionCookie = {
  name: ADMIN_SESSION_COOKIE,
  maxAge: ADMIN_SESSION_TTL_SECONDS,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  },
};

export function getAdminAuthSetupError() {
  return 'Admin access is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD (20+ characters), and ADMIN_SESSION_SECRET (32+ characters) on the server.';
}
