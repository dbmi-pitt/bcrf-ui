import { COOKIE_NAME, decryptSessionToken } from '@/lib/globus/session';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/about'];

export async function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  const pathname = request.nextUrl.pathname;

  const isProtected = !PUBLIC_PATHS.some((path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  });

  if (isProtected) {
    const rawSession = request.cookies.get(COOKIE_NAME)?.value;
    const session = await decryptSessionToken(rawSession);

    if (!session) {
      const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (isProtected) {
    // Prevent caching of protected pages
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|imgs|content).*)'],
};
