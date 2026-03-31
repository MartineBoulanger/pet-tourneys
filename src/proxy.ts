import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Skip voor:
  // - API routes
  // - Static files (_next, assets, etc.)
  // - Favicon, sitemap, robots.txt
  // - Public files & pages that don't need auth
  const shouldSkip =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('/analyze-tool') ||
    pathname.includes('/resources') ||
    pathname.includes('/privacy-policy') ||
    pathname.includes('/cookies-policy') ||
    pathname.startsWith('/leagues') ||
    pathname.startsWith('/pets') ||
    pathname.startsWith('/guides') ||
    pathname.startsWith('/articles') ||
    pathname.startsWith('/pet-reviews') ||
    pathname.startsWith('/json-files') ||
    pathname.includes('.') || // files met extensies zoals .js, .css, .png
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/public/') ||
    pathname.endsWith('/') ||
    pathname === '/login';
  if (shouldSkip) {
    return NextResponse.next();
  }
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user && !pathname.includes('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
