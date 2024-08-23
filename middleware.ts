import { NextResponse } from 'next/server';
import cookie from 'cookie';

export function middleware(req: {
  headers: { get: (arg0: string) => any };
  nextUrl: { pathname: string };
  url: string | URL | undefined;
}) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const sessionToken = cookies['session-token'];

  if (sessionToken && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (
    (!sessionToken && req.nextUrl.pathname.startsWith('/dashboard')) ||
    (!sessionToken && req.nextUrl.pathname.startsWith('/results'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/register', '/results'],
};
