import { getComments } from '@/actions/supabase/cms-schema/comments/getComments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { Container, Heading } from '@/components/ui';
import { toastError } from '@/utils/toast';
import { CommentsSectionProps } from '@/types/components.types';

export async function CommentsSection({
  pageid,
  username,
  isAdmin = false,
  isLoggedIn = false,
  userId = null,
  path,
}: CommentsSectionProps) {
  const { success, data, error } = await getComments(pageid);

  if (!success && error) toastError(error);

  return (
    <div className='px-5 mt-5'>
      <Container className='space-y-2.5 lg:space-y-5 mb-10 px-0 lg:px-0'>
        <div className='bg-light-grey p-2.5 lg:p-5 rounded-lg'>
          <Heading as='h2' className='mb-2.5'>
            {'Comments'}
          </Heading>
          <CommentList
            comments={data || []}
            username={username || ''}
            isAdmin={isAdmin}
            path={path}
          />
        </div>
        <CommentForm
          pageid={pageid}
          username={username || ''}
          isLoggedIn={isLoggedIn}
          path={path}
          userId={userId}
        />
      </Container>
    </div>
  );
}
