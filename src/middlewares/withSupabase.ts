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
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      !request.nextUrl.pathname.startsWith('/matches') &&
      !request.nextUrl.pathname.startsWith('/tournaments') &&
      !request.nextUrl.pathname.startsWith('/auth') &&
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
