import RichText from './RichText';
import Asset from './Asset';
import Cta from './Cta';
import { BannerProps } from './types';
import { cn } from '@/utils/cn';

const Banner = ({ component, isPage = false, className }: BannerProps) => {
  if (!component) return null;
  const { bannerImage, bannerText, bannerActionsCollection } = component;

  return bannerImage ? (
    <div className={cn('w-full h-full relative', className)}>
      <Asset component={bannerImage} isBanner isPage={isPage} />
      {bannerText ? (
        <div
          className={cn(
            'p-5 shadow-md bg-background',
            isPage
              ? 'rounded-lg md:bg-background/80 md:absolute md:top-5 md:left-5 lg:top-[22.5%] lg:left-[15%]'
              : 'rounded-b-lg min-[425px]:rounded-lg min-[425px]:bg-background/80 min-[425px]:absolute min-[425px]:bottom-5 min-[425px]:left-5 min-[425px]:right-5 lg:bottom-[15%] lg:left-[15%] lg:right-[15%]'
          )}
        >
          <RichText component={bannerText} className='w-full max-w-[700px]' />
          {bannerActionsCollection?.items &&
          bannerActionsCollection.items.length > 0 ? (
            <div className='flex flex-wrap items-center justify-center lg:justify-end gap-2.5 lg:gap-5 mt-5 lg:mt-10 w-full'>
              {bannerActionsCollection.items.map((cta, index) => (
                <Cta key={index} component={cta} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;
};

export default Banner;
