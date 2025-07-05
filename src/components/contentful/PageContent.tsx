import dynamic from 'next/dynamic';
import { PageContentItem, PageContentProps } from './types';
import { Fragment } from 'react';

const REGISTERED_COMPONENTS = {
  ContentTypeRichText: () =>
    dynamic(() => import('@/components/contentful/RichText')),
  ContentLayout: () =>
    dynamic(() => import('@/components/contentful/ContentLayout')),
  YouTubeVideo: () =>
    dynamic(() => import('@/components/contentful/YouTubeVideo')),
};

const componentMap = new Map();

const getRegisteredComponent = (component: PageContentItem | null) => {
  if (!component || !component.__typename) return null;
  const type = component.__typename;
  if (componentMap.has(type)) {
    return componentMap.get(type);
  }
  const componentLoader = REGISTERED_COMPONENTS[type];
  if (!componentLoader) return null;
  const componentBlock = componentLoader();
  componentMap.set(type, componentBlock);
  return componentBlock;
};

const PageContent = ({ components }: PageContentProps) => {
  if (!components) return null;

  return (
    <div className='flex flex-col rounded-b-lg bg-background'>
      {components.map((component, index) => {
        const Block = getRegisteredComponent(component);
        if (!Block) return null;
        return (
          <Fragment key={`block-${index}`}>
            <Block component={component} />
            <div className='h-0.5 w-[98.3%] mx-auto bg-light-grey rounded-lg my-2.5 lg:my-5 last:hidden' />
          </Fragment>
        );
      })}
    </div>
  );
};

export default PageContent;
