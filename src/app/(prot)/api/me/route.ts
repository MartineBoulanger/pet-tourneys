import { getUserSession } from '@/actions/supabase/api-schema/auth/getUserSession';

export async function GET() {
  const res = await getUserSession();

  if (!res?.user) {
    return Response.json({ user: null });
  }

  return Response.json({
    user: {
      id: res.user.id,
      role: res.user.role,
      avatar_url: res.user.avatar_url,
      username: res.user.username,
    },
  });
}
