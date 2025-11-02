import { getCommentsByPageId } from '@/features/cms/actions/comments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { Container, Heading } from '@/components/ui';

export async function CommentsSection({
  pageId,
  username,
  isAdmin = false,
  path,
}: {
  pageId: string;
  path: string;
  username?: string | null;
  isAdmin?: boolean;
}) {
  const comments = await getCommentsByPageId(pageId);

  return (
    <div className='px-5 mt-5'>
      <Container className='space-y-2.5 lg:space-y-5 mb-10 px-0 lg:px-0'>
        <Heading as='h2'>{'Comments'}</Heading>
        <CommentList
          comments={comments}
          username={username || undefined}
          isAdmin={isAdmin}
          path={path}
        />
        <CommentForm
          pageId={pageId}
          username={username || undefined}
          path={path}
        />
      </Container>
    </div>
  );
}
