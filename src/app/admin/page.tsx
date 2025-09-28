import { Container, Divider, Paragraph } from '@/components/ui';

export default function AdminPanelPage() {
  return (
    <>
      <Divider alignment='horizontal' color='light-grey' height='0.5' />
      <Container className='px-0 lg:px-0'>
        <Paragraph className='bg-background py-2.5 px-2.5 lg:px-5 text-center rounded-lg shadow-md'>
          {
            'Hi! Welcome back on your admin panel, at the left you will see the navigation to what you need or want to do. If you are seeing this on a mobile device, you will see the menu button at the left side, this will open the navigation.'
          }
        </Paragraph>
      </Container>
    </>
  );
}
