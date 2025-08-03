import { StaticImageData } from 'next/image';
import {
  CustomImage,
  FocalPoint,
  RenderedComponentProps,
  BreakPointClassShape,
  DeriveCarouselItemKeyParams,
} from './types';

// default variables
export const DEFAULT_BLUR_WIDTH = 400;
export const DEFAULT_BLUR_QUALITY = 40;
export const DEFAULT_ASPECT_RATIO = [16, 9];
export const DEFAULT_DURATION = 5000;

// object to set classes for each breakpoint
export const breakPointClasses: BreakPointClassShape = {
  xs: { desktop: 'hidden xs:flex', mobile: 'flex xs:hidden' },
  sm: { desktop: 'hidden sm:flex', mobile: 'flex sm:hidden' },
  md: { desktop: 'hidden md:flex', mobile: 'flex md:hidden' },
  lg: { desktop: 'hidden lg:flex', mobile: 'flex lg:hidden' },
  xl: { desktop: 'hidden xl:flex', mobile: 'flex xl:hidden' },
};

// to get the position of the focal point in the image
export const getObjectPosition = (
  image?: Partial<StaticImageData> & CustomImage,
  focal?: FocalPoint
) => {
  return image?.width && image?.height && focal?.x && focal?.y
    ? `${100 * (focal?.x / image?.width)}% ${100 * (focal?.y / image?.height)}%`
    : undefined;
};

// to check if the value is a function
export const isFunction = (
  value: unknown
): value is (props: RenderedComponentProps) => React.ReactNode =>
  typeof value === 'function';

// derive the key for the images in the carousel
export const deriveCarouselItemKey = ({
  carouselItem,
  isFirstItem,
  isLastItem,
  isMobileDevice,
}: DeriveCarouselItemKeyParams) => {
  if (typeof carouselItem === 'string' || typeof carouselItem === 'number')
    return `${isFirstItem ? 'first-' : ''}${
      isLastItem ? 'last-' : ''
    }${carouselItem}`;

  return [
    isFirstItem ? 'first' : '',
    isLastItem ? 'last' : '',
    isMobileDevice ? 'mobile' : 'desktop',
    carouselItem.mobile?.image?.src || '',
    carouselItem.desktop?.image?.src || '',
    Date.now(), // Add timestamp to ensure uniqueness
  ]
    .filter(Boolean)
    .join('-');
};
