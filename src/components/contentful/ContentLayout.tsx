import dynamic from 'next/dynamic';
import { ContentLayoutItem, ContentLayoutProps } from './types';
import { cn } from '@/utils/cn';

const REGISTERED_COMPONENTS = {
  Banner: () => dynamic(() => import('@/components/contentful/Banner')),
  ContentTypeRichText: () =>
    dynamic(() => import('@/components/contentful/RichText')),
  YouTubeVideo: () =>
    dynamic(() => import('@/components/contentful/YouTubeVideo')),
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

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        layout === '2 Columns' && 'lg:grid-cols-2'
      )}
    >
      {contentCollection.items.map((component, index) => {
        const Block = getRegisteredComponent(component);
        if (!Block) return null;
        return <Block key={`block-${index}`} component={component} isContentLayout />;
      })}
    </div>
  );
};

export default ContentLayout;
