import dynamic from 'next/dynamic';
import { ContentLayoutItem, ContentLayoutProps } from './types';
import { cn } from '@/utils/cn';

const REGISTERED_COMPONENTS = {
  ContentTypeAsset: () =>
    dynamic(() => import('@/components/contentful/Asset')),
  ContentTypeRichText: () =>
    dynamic(() => import('@/components/contentful/RichText')),
};

const componentMap = new Map();

const getRegisteredComponent = (component: ContentLayoutItem | null) => {
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

const ContentLayout = ({ component }: ContentLayoutProps) => {
  if (!component) return null;
  const { layout, contentCollection } = component;
  if (!contentCollection.items) return null;

  let setLayout: string;
  if (layout === '2 Columns') {
    setLayout = 'lg:grid-cols-2';
  } else if (layout === '3 Columns') {
    setLayout = 'lg:grid-cols-3';
  } else {
    setLayout = '';
  }

  return (
    <div
      className={cn(
        'p-2.5 sm:p-5 rounded-lg bg-background grid grid-cols-1 gap-2.5 lg:gap-5',
        setLayout
      )}
    >
      {contentCollection.items.map((component, index) => {
        const Block = getRegisteredComponent(component);
        if (!Block) return null;
        return <Block key={`block-${index}`} component={component} />;
      })}
    </div>
  );
};

export default ContentLayout;
