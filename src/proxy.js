import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login'];

export function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  // A very simple check to see if the user has a cookie. Get user session
  // on the client.
  const isProtected = !PUBLIC_PATHS.includes(request.nextUrl.pathname);
  if (isProtected && !request.cookies.has('globus_session')) {
    const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
