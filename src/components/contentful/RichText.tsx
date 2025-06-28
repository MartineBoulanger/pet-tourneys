import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Link from 'next/link';
import { RichTextProps } from './types';
import { cn } from '@/utils/cn';
import { Heading } from '@/components/ui';

const options = (): Options => {
  return {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        const p = node?.nodeType === 'paragraph';
        if (!p) return null;
        return <p className='mb-2.5 lg:mb-5 last:mb-0'>{children}</p>;
      },
      [BLOCKS.HEADING_1]: (node, children) => {
        const h1 = node?.nodeType === 'heading-1';
        if (!h1) return null;
        return (
          <Heading className='lg:text-4xl text-foreground'>{children}</Heading>
        );
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        const h2 = node?.nodeType === 'heading-2';
        if (!h2) return null;
        return (
          <Heading as='h2' className='mb-2.5'>
            {children}
          </Heading>
        );
      },
      [BLOCKS.HEADING_3]: (node, children) => {
        const h3 = node?.nodeType === 'heading-3';
        if (!h3) return null;
        return (
          <Heading as='h3' className='font-bold text-xl text-humanoid mb-1.5'>
            {children}
          </Heading>
        );
      },
      [BLOCKS.HEADING_4]: (node, children) => {
        const h4 = node?.nodeType === 'heading-4';
        if (!h4) return null;
        return (
          <Heading as='h4' className='font-bold text-lg text-humanoid mb-1'>
            {children}
          </Heading>
        );
      },
      [BLOCKS.HEADING_5]: (node, children) => {
        const h5 = node?.nodeType === 'heading-5';
        if (!h5) return null;
        return (
          <Heading as='h5' className='text-blue font-bold text-base mb-1'>
            {children}
          </Heading>
        );
      },
      [BLOCKS.HEADING_6]: (node, children) => {
        const h6 = node?.nodeType === 'heading-6';
        if (!h6) return null;
        return (
          <Heading as='h6' className='text-sm font-bold text-blue mb-1'>
            {children}
          </Heading>
        );
      },
      [BLOCKS.QUOTE]: (node, children) => {
        const quote = node?.nodeType === 'blockquote';
        if (!quote) return null;
        return (
          <q className='text-humanoid flex italic mb-1.5 lg:mb-5'>{children}</q>
        );
      },
      [BLOCKS.HR]: (node) => {
        const hr = node?.nodeType === 'hr';
        if (!hr) return null;
        return (
          <div className='h-0.5 rounded-lg w-full bg-light-grey my-2.5 lg:my-5' />
        );
      },
      [BLOCKS.UL_LIST]: (node, children) => {
        const ul = node?.nodeType === 'unordered-list';
        if (!ul) return null;
        return <ul className='mb-2.5 lg:mb-5 ml-5'>{children}</ul>;
      },
      [BLOCKS.OL_LIST]: (node, children) => {
        const ol = node?.nodeType === 'ordered-list';
        if (!ol) return null;
        return <ol className='mb-2.5 lg:mb-5 ml-5'>{children}</ol>;
      },
      [BLOCKS.LIST_ITEM]: (node, children) => {
        const listItem = node?.nodeType === 'list-item';
        if (!listItem) return null;
        return <li className='list-disc'>{children}</li>;
      },
      [INLINES.HYPERLINK]: (node, children) => {
        const url = node?.data?.uri;
        if (!url) return null;
        return (
          <Link
            title={typeof children === 'string' ? children : 'inline text link'}
            className='btn-link text-humanoid underline hover:text-light-blue'
            href={url}
          >
            {children}
          </Link>
        );
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text) => (
        <span className='font-bold text-humanoid'>{text}</span>
      ),
      [MARKS.ITALIC]: (text) => (
        <span className='italic text-light-blue'>{text}</span>
      ),
      [MARKS.UNDERLINE]: (text) => <span className='underline'>{text}</span>,
      [MARKS.STRIKETHROUGH]: (text) => (
        <span className='line-through text-foreground/60'>{text}</span>
      ),
    },
  };
};

const RichText = ({ component, className }: RichTextProps) => {
  if (!component) return null;
  const { text, textAligned } = component;
  const aligned = textAligned ? textAligned : 'left';
  const textOptions = options();

  return text && text.json ? (
    <div
      className={cn(
        'leading-normal w-full',
        textAligned && `text-${aligned}`,
        className
      )}
    >
      {documentToReactComponents(text.json, textOptions)}
    </div>
  ) : null;
};

export default RichText;
