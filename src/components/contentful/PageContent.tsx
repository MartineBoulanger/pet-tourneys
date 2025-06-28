import dynamic from 'next/dynamic';
import { PageContentItem, PageContentProps } from './types';

const REGISTERED_COMPONENTS = {
  Banner: () => dynamic(() => import('@/components/contentful/Banner')),
  ContentLayout: () =>
    dynamic(() => import('@/components/contentful/ContentLayout')),
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
    <div className='flex flex-col gap-2.5 lg:gap-5'>
      {components.map((component, index) => {
        const Block = getRegisteredComponent(component);
        if (!Block) return null;
        return <Block key={`block-${index}`} component={component} />;
      })}
    </div>
  );
};

export default PageContent;
