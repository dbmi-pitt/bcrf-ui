import { isProtectedPath } from '@/lib/auth/paths';
import { getCurrentUser } from '@/lib/auth/services';
import { hasCurrentUserGlobalReadPermission } from '@/lib/permission/actions';
import { NextResponse } from 'next/server';

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  const isProtected = isProtectedPath(pathname);
  if (isProtected) {
    const user = await getCurrentUser(request);
    if (!user) {
      const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const hasPermission = await hasCurrentUserGlobalReadPermission();
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
