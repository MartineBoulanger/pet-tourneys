'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useState, useEffect } from 'react';
import { HiListBullet } from 'react-icons/hi2';
import { VscListOrdered } from 'react-icons/vsc';
import { FaLink } from 'react-icons/fa6';

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  imgClassName?: string;
};

export function RichTextEditor({
  content,
  onChange,
  className,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) return <div>Loading editor...</div>;

  return (
    <div
      className={`border border-light-grey rounded-lg overflow-hidden ${className}`}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className='min-h-[350px] overflow-x-auto p-2.5 lg:p-5 bg-foreground text-background prose'
      />
    </div>
  );
}

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const handleButtonClick = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    action();
  };

  return (
    <div className='flex flex-wrap items-center gap-1 p-2.5 border-b border-b-light-grey bg-light-grey'>
      {/* Paragraph */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().setParagraph().run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('paragraph') ? '' : 'hover:bg-background'
        }`}
        title='Paragraph'
      >
        {'P'}
      </button>

      {/* Heading 1 */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('heading', { level: 1 }) ? '' : 'hover:bg-background'
        }`}
        title='Heading 1'
      >
        {'H1'}
      </button>

      {/* Heading 2 */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('heading', { level: 2 }) ? '' : 'hover:bg-background'
        }`}
        title='Heading 2'
      >
        {'H2'}
      </button>

      {/* Heading 3 */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('heading', { level: 3 }) ? '' : 'hover:bg-background'
        }`}
        title='Heading 3'
      >
        {'H3'}
      </button>

      {/* Heading 4 */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 4 }).run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('heading', { level: 4 }) ? '' : 'hover:bg-background'
        }`}
        title='Heading 4'
      >
        {'H4'}
      </button>

      {/* Heading 5 */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 5 }).run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('heading', { level: 5 }) ? '' : 'hover:bg-background'
        }`}
        title='Heading 5'
      >
        {'H5'}
      </button>

      {/* Heading 6 */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleHeading({ level: 6 }).run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('heading', { level: 6 }) ? '' : 'hover:bg-background'
        }`}
        title='Heading 6'
      >
        {'H6'}
      </button>

      <div className='w-0.5 h-8 bg-medium-grey rounded-lg mx-2.5' />

      {/* Bold */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleBold().run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('bold') ? '' : 'hover:bg-background'
        }`}
        title='Bold'
      >
        <strong>{'B'}</strong>
      </button>

      {/* Italic */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleItalic().run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('italic') ? '' : 'hover:bg-background'
        }`}
        title='Italic'
      >
        <em>{'I'}</em>
      </button>

      {/* Underline */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleUnderline().run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('underline') ? '' : 'hover:bg-background'
        }`}
        title='Italic'
      >
        <u>{'U'}</u>
      </button>

      <div className='w-0.5 h-8 bg-medium-grey rounded-lg mx-2.5' />

      {/* Bullet List */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleBulletList().run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('bulletList') ? '' : 'hover:bg-background'
        }`}
        title='Bullet List'
      >
        <HiListBullet />
      </button>

      {/* Ordered List */}
      <button
        onClick={handleButtonClick(() =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        className={`p-2.5 rounded ${
          editor.isActive('orderedList') ? '' : 'hover:bg-background'
        }`}
        title='Numbered List'
      >
        <VscListOrdered />
      </button>

      <div className='w-0.5 h-8 bg-medium-grey rounded-lg mx-2.5' />

      {/* Link */}
      <button
        onClick={handleButtonClick(() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);

          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        })}
        className={`p-2.5 rounded ${
          editor.isActive('link') ? '' : 'hover:bg-background'
        }`}
        title='Link'
      >
        <FaLink />
      </button>
    </div>
  );
}
