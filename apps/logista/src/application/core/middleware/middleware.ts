import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwt } from '../../../../../../packages/utils/src/verifyjwt'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  const valid = await verifyJwt(token);
  if (!valid) return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next();
}

export const config = { matcher: ['/lojista/:path*'] }
