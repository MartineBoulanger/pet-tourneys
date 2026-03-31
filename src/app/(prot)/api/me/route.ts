import { sbServer } from '@/lib/supabase/server';
import { getUser } from '@/actions/supabase/auth-actions';
import { SCHEMA } from '@/types/supabase.types';

export async function GET() {
  const { data, error } = await getUser();
  if (error || !data?.user) {
    return Response.json({ user: null });
  }
  const sb = await sbServer();
  const { data: user, error: userError } = await sb
    .schema(SCHEMA.API)
    .from('profiles')
    .select('*')
    .eq('id', data?.user.id)
    .limit(1)
    .single();
  console.log(user);
  if (userError || !user) {
    return Response.json({ user: null });
  }
  return Response.json({
    user: {
      id: user.id,
      role: user.role,
      avatar_url: user.avatar_url,
      username: user.username,
    },
  });
}
