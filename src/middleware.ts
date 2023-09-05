import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

/* 권한에 따른 인가처리 */
export async function middleware(req: NextRequest) {
  // 세션 정보
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  // 현재페이지 URL
  const pathname = req.nextUrl.pathname;

  // 로그인 된 유저만 접근 가능
  if (pathname.startsWith('/user') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // 어드민 유저만 접근 가능
  if (pathname.startsWith('/admin') && session?.role !== 'Admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  // 로그인된 유저는 로그인, 회원가입 페이지에 접근금지
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// 로그인이 된 사람만 페이지 경로에 접근
// /admin/:path* => admin 으로 시작하는 모든 경로는 로그인해야 접근가능
// export const config = { matcher: ['/admin/:path*', '/user'] };
