import { type NextRequest, NextResponse, userAgent as getUserAgent } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const url = request.nextUrl;
  const pathname = url.pathname;
  const searchParams = new URLSearchParams(url.searchParams);
  const xff = `${(request.headers.get('x-forwarded-for') ?? '127.0.0.1')?.split(',')[0]}`;

  const responseCookies = response.cookies;
  const requestCookies = request.cookies;
  const session = requestCookies.get('session');

  const next = decodeURIComponent(searchParams.get('next') ?? '/');

  if (pathname.startsWith('/images') || pathname === '/favicon.ico') {
    return response;
  }

  let user: User | undefined;

  if (session) {
    const { os, device } = getUserAgent(request);

    const userAgent = `${os.name} ${os.version} (${device.vendor}, ${device.model})`;
    const headers = new Headers();

    headers.append('x-forwarded-for', xff);
    headers.append('cookie', `session=${session.value}`);
    headers.append('user-agent', userAgent);

    const handleLogout = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: 'POST',
          headers,
        });
      } catch (_) {}
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        method: 'GET',
        headers,
      });

      const me = await response.json();

      if (me.statusCode === 401) {
        responseCookies.delete(session);
      }

      if (me.statusCode === 403 && pathname !== '/sign-in') {
        await handleLogout();
        const redirectUrl = new URL('/sign-in?error=403', url);
        return NextResponse.redirect(redirectUrl);
      }

      if (me.email) {
        user = me;
      }
    } catch (_) {}
  }

  if (!user && pathname !== '/sign-in' && pathname !== '/sign-up') {
    const redirectUrl = new URL(
      pathname !== '/' ? `/sign-in?next=${pathname}` : '/sign-in',
      url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (user && user.isActive && pathname !== '/') {
    const redirectUrl = new URL(
      `/?to=${
        next !== '/'
          ? next
          : !['/sign-in', '/sign-up'].includes(pathname)
          ? pathname
          : '/'
      }`,
      url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  responseCookies.set('x-forwarded-for', xff);

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
