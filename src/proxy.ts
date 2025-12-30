import { chain } from '@/middlewares/chain';
import { withSupabase } from '@/middlewares/withSupabase';

export default chain([withSupabase]);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
