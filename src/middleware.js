// middleware.js (or middleware.ts)

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname, searchParams } = req.nextUrl;

  // Allow requests to static assets and NextAuth pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token and trying to access a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow logged-in users to access /welcome *only* if redirected from sign-in
  if (token && pathname === '/welcome') {
    const fromSignIn = searchParams.get('fromSignIn');

    if (fromSignIn === 'true') {
      // User came from sign-in, allow access and do something.
      console.log('User accessing /welcome after sign-in:', token.email);
      const response = NextResponse.next();
      response.headers.set('X-Welcome-From-Signin', 'true'); //example of response modification
      return response;
    } else {
      // User did not come from sign-in, redirect or deny access.
      return NextResponse.redirect(new URL('/', req.url)); // Redirect to home or another page
      // or return NextResponse.rewrite(new URL('/denied',req.url)) //rewrite the url to denied if you created a denied page.
    }
  }

  // Allow logged-in users to access other protected routes.
  if (token) {
    return NextResponse.next();
  }

  // If none of the above conditions are met, proceed as normal.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/welcome', '/protected/:path*'],
};