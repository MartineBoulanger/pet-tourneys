import Link from 'next/link';
import { Button } from '@/components/ui';
import { CtaProps } from '@/types';

const Cta = ({ component }: CtaProps) => {
  if (!component) return null;
  const { ctaText, ctaUrl } = component;
  return ctaUrl ? (
    <Link className='btn-submit py-2 px-4 rounded uppercase' href={ctaUrl}>
      {ctaText}
    </Link>
  ) : (
    <Button variant='primary'>{ctaText}</Button>
  );
};

export default Cta;
