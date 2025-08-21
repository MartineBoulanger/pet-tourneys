import { StaticImageData } from 'next/image';

export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Device<T extends string | number> = {
  desktop?: T;
  mobile?: T;
};

export type BreakPointClassShape = { [key in BreakPoint]: Device<string> };

export type FocalPoint = {
  x: number;
  y: number;
};

export type CustomImage = {
  alt?: string;
  imageFP?: FocalPoint;
};

export type RenderedComponentProps = {
  increment: () => void;
  decrement: () => void;
  jumpTo: (index: number) => void;
};

export type CarouselItemComponent = {
  image?: Partial<StaticImageData> & CustomImage;
  component?:
    | React.ReactNode
    | ((props: RenderedComponentProps) => React.ReactNode);
};

export type CarouselItem = {
  key?: string;
  imageId?: string;
  mobile?: CarouselItemComponent;
  desktop?: CarouselItemComponent;
};

export type CarouselProps = {
  items: CarouselItem[];
  heights?: Device<number>;
  breakpoint?: BreakPoint;
  slideDuration?: number;
  noAutoPlay?: boolean;
  loadingComponent?: React.ReactNode;
  blurQuality?: number;
  noBlur?: boolean;
  ariaLabel?: string;
  showControls?: boolean;
  thumbnails?: CarouselItem[] | string[] | number[];
  autoPlayOutsideViewport?: boolean;
  pauseOnHover?: boolean;
};

export type DeriveCarouselItemKeyParams = {
  carouselItem: CarouselItem;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  isMobileDevice?: boolean;
};

export type CarouselThumbnailType = 'images' | 'numbers' | 'strings';

export type CarouselSettings = {
  slideDuration: number;
  noAutoPlay: boolean;
  noBlur: boolean;
  showControls: boolean;
  autoPlayOutsideViewport: boolean;
  pauseOnHover: boolean;
  thumbnailType: CarouselThumbnailType;
  customThumbnails?: string[] | number[];
};

export type CarouselData = {
  items: CarouselItem[];
  settings: CarouselSettings;
};
