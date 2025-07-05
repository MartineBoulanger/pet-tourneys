import Link from 'next/link';
import { Button } from '@/components/ui';
import { CtaProps } from './types';

const Cta = ({ component }: CtaProps) => {
  if (!component) return null;
  const { ctaText, ctaUrl, ctaVariant } = component;
  const hasVariant =
    ctaVariant === 'secondary'
      ? 'secondary'
      : ctaVariant === 'link'
      ? 'link'
      : 'primary';

  return ctaUrl ? (
    <Link className='btn-submit py-2 px-4 rounded uppercase' href={ctaUrl}>
      {ctaText}
    </Link>
  ) : (
    <Button variant={hasVariant}>{ctaText}</Button>
  );
};

export default Cta;
