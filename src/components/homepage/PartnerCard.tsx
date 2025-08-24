import { cn } from '@/utils/cn';
import { Paragraph } from '@/components/ui';
import Image from 'next/image';

interface PartnerCardProps {
  partner: {
    image: string;
    name: string;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const PartnerCard = ({
  partner,
  size = 'medium',
  className = '',
}: PartnerCardProps) => {
  const sizeMap = {
    small: { width: 150, height: 150 },
    medium: { width: 190, height: 190 },
    large: { width: 250, height: 250 },
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center transition-all duration-300 hover:scale-102 max-w-[150px] lg:max-w-[250px]',
        className
      )}
    >
      <div className='relative'>
        <Image
          src={partner.image}
          alt={partner.name}
          width={sizeMap[size].width}
          height={sizeMap[size].height}
          className='w-full h-full object-contain'
          loading='lazy'
          unoptimized
        />
      </div>
      <Paragraph
        className={`mt-2.5 text-foreground text-center font-bold ${
          size === 'large'
            ? 'text-base lg:text-lg'
            : size === 'medium'
            ? 'text-sm lg:text-base'
            : 'text-sm'
        }`}
      >
        {partner.name}
      </Paragraph>
    </div>
  );
};
