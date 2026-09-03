import { getCurrentUser } from '@/lib/auth/services';
import { hasGlobalReadPermission } from '@/lib/permission/services';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/about'];

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  const isProtected = !PUBLIC_PATHS.some((path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  });

  if (isProtected) {
    const user = await getCurrentUser(request);
    if (!user) {
      const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const hasPermission = await hasGlobalReadPermission();
    if (!hasPermission) {
      const url = new URL(
        '/unauthorized',
        process.env.NEXT_PUBLIC_APP_BASE_URL,
      );
      return NextResponse.rewrite(url);
    }
  }

  const response = NextResponse.next();

  if (isProtected) {
    // Prevent caching of protected pages
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|imgs|content).*)'],
};
