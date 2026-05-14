import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASS;
    if (!user || !pass) {
      return new NextResponse('Not Found', { status: 404 });
    }
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ')) {
      return new NextResponse('Auth required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Indizi Cosmici Admin"' }
      });
    }
    const [u, p] = atob(auth.split(' ')[1]).split(':');
    if (u !== user || p !== pass) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
