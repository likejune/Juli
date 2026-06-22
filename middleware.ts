import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'jb_admin_session';

/** Protects /admin pages and /api/admin routes (Edge runtime — jose only). */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi = pathname.startsWith('/api/admin');
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;
  if (token && process.env.SESSION_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (valid) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.search = '';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
