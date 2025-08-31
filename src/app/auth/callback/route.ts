import { NextResponse } from 'next/server';
import { createClient } from '@/features/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return NextResponse.redirect(`${origin}/error`);
      }
      const { data: existingUser } = await supabase
        .schema('api')
        .from('profiles')
        .select('*')
        .eq('id', data?.user?.id)
        .limit(1)
        .single();

      if (!existingUser) {
        const { error: dbError } = await supabase
          .schema('api')
          .from('profiles')
          .insert({
            id: data?.user.id,
            email: data?.user.email || '',
            username: data?.user.user_metadata.custom_claims.global_name,
            role: 'user',
            discord_id: data?.user.user_metadata.provider_id,
            avatar_url: data?.user.user_metadata.avatar_url,
          });
        if (dbError) {
          console.error('Error inserting user data:', dbError.message);
          return NextResponse.redirect(`${origin}/error`);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/error`);
}
