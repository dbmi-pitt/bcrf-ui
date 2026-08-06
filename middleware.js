import { NextResponse } from 'next/server';

export function middleware(req) {
  const hasSession = req.cookies.has('globus_session');
  if (!hasSession) {
    const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
    url.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/sources', '/sources/:dataSource', '/sources/:dataSource/about'],
};
