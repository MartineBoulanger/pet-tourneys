'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ImageSelector from './ImageSelector';
import { ImageUpload } from '@/mongoDB/types';
import Carousel from '@/components/carousel';
import { RichTextEditor } from '@/components/ui';

interface BlogPost {
  title: string;
  content: string;
  featuredImage?: ImageUpload | null;
  thumbnailImage?: ImageUpload | null;
  thumbnailImages?: ImageUpload[];
  galleryImages?: ImageUpload[];
}

export function ExampleUsageForms() {
  // Single image selection example (Blog Post)
  const [showPost, setShowPost] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '',
    content: '',
    featuredImage: null,
    thumbnailImage: null,
    thumbnailImages: [],
    galleryImages: [],
  });

  const carouselItems =
    blogPost.galleryImages && blogPost.galleryImages.length > 0
      ? blogPost.galleryImages.map((item) => ({
          key: item._id,
          mobile: {
            image: {
              src: item.src,
              alt: item.alt,
              width: item.width,
              height: item.height,
            },
          },
          desktop: {
            image: {
              src: item.src,
              alt: item.alt,
              width: item.width,
              height: item.height,
            },
          },
        }))
      : [];

  const handleContentChange = (content: string) => {
    setBlogPost((prev) => ({
      ...prev,
      content,
    }));
  };

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-12'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        Image Selector Examples
      </h1>

      {/* Blog Post Form Example */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800'>
          Blog Post Form
        </h2>

        <div className='space-y-6'>
          {/* Title Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Post Title
            </label>
            <input
              type='text'
              value={blogPost.title}
              onChange={(e) =>
                setBlogPost((prev) => ({ ...prev, title: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter post title...'
            />
          </div>

          {/* Featured Image Selector */}
          <ImageSelector
            selectedImageId={blogPost.featuredImage?._id}
            onImageSelect={(image) =>
              setBlogPost((prev) => ({ ...prev, featuredImage: image }))
            }
            label='Featured Image'
            placeholder='Select a featured image for your blog post'
            showPreview={true}
            allowNull={true}
            className='mb-4'
          />

          {/* Thumbnail Image Selector */}
          <ImageSelector
            selectedImageIds={blogPost.galleryImages?.map((d) => d._id)}
            onImagesSelect={(image) =>
              setBlogPost((prev) => ({ ...prev, galleryImages: [...image] }))
            }
            multiple
            maxSelection={5}
            label='Thumbnail Images'
            placeholder='Select thumbnail images'
            showPreview={true}
            allowNull={true}
            className='mb-4'
          />

          {/* Content Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Content
            </label>
            <RichTextEditor
              content={blogPost.content}
              onChange={handleContentChange}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end gap-4'>
        <button
          onClick={() => setShowPost(false)}
          className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Cancel
        </button>
        <button
          onClick={() => setShowPost(true)}
          className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Save Changes
        </button>
      </div>

      {/* Blog post */}
      {showPost && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-background font-bold text-xl mb-2.5'>
            {blogPost.title}
          </h3>
          <div
            className='text-background mb-2.5'
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
          {blogPost.galleryImages && blogPost.galleryImages.length > 0 ? (
            <Carousel
              items={carouselItems}
              breakpoint='lg'
              showControls
              noAutoPlay
              thumbnails={carouselItems}
              autoPlayOutsideViewport={false}
            />
          ) : null}
          {blogPost.featuredImage && (
            <Image
              src={blogPost.featuredImage.src}
              alt={blogPost.featuredImage.alt}
              className='w-full object-cover rounded-lg'
              width={blogPost.featuredImage.width}
              height={blogPost.featuredImage.height}
            />
          )}
        </div>
      )}
    </div>
  );
}
