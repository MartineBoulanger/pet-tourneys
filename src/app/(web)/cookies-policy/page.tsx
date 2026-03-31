import { Container, Heading, Paragraph } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Privacy Policy',
    description: 'Our privacy policy - and cookie declaration',
    alternates: {
      canonical: `${process.env.BASE_URL!}/privacy-policy`,
    },
  };
}
// TODO: split dit in losse componenten - of beter, maak een table component dat dan overal gebruikt kan worden
export default async function PrivacyPage() {
  return (
    <Container className='lg:px-5'>
      <Heading>{'Cookies Policy'}</Heading>
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
      <div className='rounded-full w-20 h-1 my-10 mx-auto bg-blue-grey' />
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
            <tr>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'Cloudinary Images cookies'}
              </td>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'Required to be able to show the images on the website.'}
              </td>
              <td className='border-b border-foreground/30 py-2.5 pr-5'>
                {'Functional'}
              </td>
              <td className='border-b border-foreground/30 py-2.5'>
                {'Session-based'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='rounded-full w-20 h-1 my-10 mx-auto bg-blue-grey' />
      <Heading as='h2' className='mb-1'>
        {'Why do we use these cookies?'}
      </Heading>
      <ul className='mb-5 list-decimal pl-5'>
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
        <li>
          {'To be able for you to see the images that are used on the website.'}
        </li>
      </ul>
      <div className='rounded-full w-20 h-1 my-10 mx-auto bg-blue-grey' />
      <Heading as='h2' className='mb-1'>
        {'Your choices'}
      </Heading>
      <ul className='mb-10 list-decimal pl-5'>
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
            'Because these authentication cookies are strictly necessary for login and security, the website cannot provide account access without them.'
          }
        </li>
      </ul>
    </Container>
  );
}
