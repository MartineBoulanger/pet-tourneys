import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { CustomMiddleware } from './chain';

export const withSupabase = (proxy: CustomMiddleware) => {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const pathname = request.nextUrl.pathname;

    // Skip voor:
    // - API routes
    // - Static files (_next, assets, etc.)
    // - Favicon, sitemap, robots.txt
    // - Public files & pages that don't need auth
    // add check here for paths that do not need to be protected
    const shouldSkip =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/auth') ||
      pathname.includes('/register') ||
      pathname.includes('/forgot-password') ||
      pathname.includes('/reset-password') ||
      pathname.includes('/analyze-tool') ||
      pathname.includes('/resources') ||
      pathname.includes('/privacy-policy') ||
      pathname.startsWith('/tournaments') ||
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

    let supabaseResponse = NextResponse.next({
      request,
    });

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
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user && !pathname.includes('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return proxy(request, event, response);
  };
};
