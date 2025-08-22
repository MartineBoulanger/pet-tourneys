import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { CustomMiddleware } from './chain';

export const withSupabase = (middleware: CustomMiddleware) => {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // add check here for paths that do not need to be protected
    if (
      !user &&
      !request.nextUrl.pathname.includes('/login') &&
      !request.nextUrl.pathname.includes('/register') &&
      !request.nextUrl.pathname.includes('/forgot-password') &&
      !request.nextUrl.pathname.includes('/reset-password') &&
      !request.nextUrl.pathname.includes('/analyze-tool') &&
      !request.nextUrl.pathname.startsWith('/tournaments') &&
      !request.nextUrl.pathname.startsWith('/guides') &&
      !request.nextUrl.pathname.startsWith('/articles') &&
      !request.nextUrl.pathname.startsWith('/pet-reviews') &&
      !request.nextUrl.pathname.startsWith('/json-files') &&
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/api') &&
      !request.nextUrl.pathname.endsWith('/sitemap.xml') &&
      !request.nextUrl.pathname.endsWith('/robots.txt') &&
      !request.nextUrl.pathname.endsWith('/')
    ) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return middleware(request, event, response);
  };
};
