import { MdMenuBook } from 'react-icons/md';
import { getRulesWithImages } from '@/features/cms/actions/rules';
import { Heading, Paragraph } from '@/components/ui';
import { SidebarNavigation } from '../SidebarNavigation';
import { RuleSection } from './RuleSection';

export async function RulesList() {
  const rulesWithImages = await getRulesWithImages();

  if (rulesWithImages.length === 0) {
    return (
      <div className='bg-light-grey rounded-lg mt-5 p-2.5 lg:p-5'>
        <div className='flex flex-col items-center justify-center text-center px-2.5 lg:px-5 py-20 bg-background rounded-lg'>
          <MdMenuBook className='text-humanoid mb-6 w-24 h-24' />
          <Heading
            as='h2'
            className='font-sans tracking-normal text-2xl font-bold mb-5'
          >
            {'No Rules Available'}
          </Heading>
          <Paragraph className='text-foreground/50'>
            {
              'There are no rules available at this moment, please come back later.'
            }
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className='relative flex bg-light-grey rounded-lg p-2.5 lg:p-5'>
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Content */}
      <div className='flex-1 min-w-0'>
        <div className='relative space-y-2.5 lg:space-y-5 bg-light-grey rounded-lg lg:pl-5'>
          {rulesWithImages.map((rule) => (
            <div key={rule._id} id={`rule-${rule._id}`} className='scroll-mt-5'>
              <RuleSection rule={rule} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
