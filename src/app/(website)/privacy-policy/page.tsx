import { Container, Heading, Paragraph, Divider } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Privacy Policy',
    description: 'Our privacy policy - and cookie declaration',
    alternates: {
      canonical: `${process.env.BASE_URL!}/privacy-policy`,
    },
  };
}

export default async function PrivacyPage() {
  return (
    <Container className='lg:px-5'>
      <Heading>{'Cookies'}</Heading>
      <Paragraph className='max-w-[700px] my-5'>
        {
          'We use cookies only where they are strictly necessary for the operation and security of our website. We do not use tracking, marketing, or analytics cookies.'
        }
      </Paragraph>
      <Heading as='h2' className='mb-1'>
        {'What are cookies?'}
      </Heading>
      <Paragraph className='max-w-[700px] mb-5'>
        {
          'Cookies are small text files stored in your browser that allow a website to recognize your device. Some cookies are essential to provide the services you request, such as logging into your account.'
        }
      </Paragraph>
      <Divider
        alignment='horizontal'
        width='80'
        height='0.5'
        color='blue-grey'
      />
      <Heading as='h2' className='mb-1'>
        {'Which cookies do we use?'}
      </Heading>
      <div className='mb-5 w-full overflow-y-auto'>
        <table className='border-collapse text-left'>
          <thead>
            <tr>
              <th className='border-b border-foreground/30 pb-2.5 pr-5'>
                {'Cookie name'}
              </th>
              <th className='border-b border-foreground/30 pb-2.5 pr-5'>
                {'Purpose'}
              </th>
              <th className='border-b border-foreground/30 pb-2.5 pr-5'>
                {'Type'}
              </th>
              <th className='border-b border-foreground/30 pb-2.5'>
                {'Retention period'}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'Supabase auth cookies (e.g. supabase-auth-token, sb:token)'}
              </td>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {
                  'Required to keep you securely logged into your account. These cookies are set only when you log in, and are removed when you log out.'
                }
              </td>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'Functional / strictly necessary'}
              </td>
              <td className='border-b border-foreground/30 py-2.5'>
                {
                  'Session-based (removed when you log out or the session expires)'
                }
              </td>
            </tr>
            <tr>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'cookie_notice_seen'}
              </td>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {
                  'Records that you have acknowledged the cookie notice popup so it is not shown again.'
                }
              </td>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'Functional'}
              </td>
              <td className='border-b border-foreground/30 py-2.5'>
                {'1 year'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Divider
        alignment='horizontal'
        width='80'
        height='0.5'
        color='blue-grey'
      />
      <Heading as='h2' className='mb-1'>
        {'Why do we use these cookies?'}
      </Heading>
      <ul className='mb-5'>
        <li>
          {
            'To provide secure access to your account (authentication and session management).'
          }
        </li>
        <li>
          {
            'To remember that you have already seen and dismissed the cookie information notice.'
          }
        </li>
      </ul>
      <Divider
        alignment='horizontal'
        width='80'
        height='0.5'
        color='blue-grey'
      />
      <Heading as='h2' className='mb-1'>
        {'Your choices'}
      </Heading>
      <ul className='mb-10'>
        <li>
          {
            'If you choose not to log in, no authentication cookies will be set.'
          }
        </li>
        <li>
          {'You may delete cookies at any time via your browser settings.'}
        </li>
        <li>
          {
            'Because these cookies are strictly necessary for login and security, the website cannot provide account access without them.'
          }
        </li>
      </ul>
    </Container>
  );
}
