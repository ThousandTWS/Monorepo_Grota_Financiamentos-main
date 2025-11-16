import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  //const token = request.cookies.get('access_token')?.value;
  //if (!token) return NextResponse.redirect(new URL('', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};