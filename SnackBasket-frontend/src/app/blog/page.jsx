'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import ProductImage from '@/components/common/ProductImage';
import { useBlogs } from '@/hooks/useBlogs';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const { data: blogs, isLoading } = useBlogs();

  const posts = (blogs ?? []).map((blog) => ({
    blog,
    slug: blog.slug,
    title: blog.title,
    category: blog.category || 'Grocery',
    date: blog.createdAt ? formatDate(blog.createdAt) : blog.date || '',
    image: blog.image,
    description: (blog.content || '').slice(0, 160),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <h1 className="text-xl font-bold text-gray-800">Blog</h1>
        <p className="text-xs text-emerald-800 font-medium">Home : Blog</p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Fresh Ideas & Grocery Tips</h2>
        <p className="text-gray-500 text-sm mt-2">
          Tips, deals and stories from the SnackBasket team
        </p>
      </div>

      {isLoading && blogs === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl">
          <h3 className="text-lg font-bold text-gray-700">No blog posts yet</h3>
          <p className="text-sm text-gray-500 mt-1">Check back soon for new tips and stories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(({ blog, slug, title, category, date, image, description }) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition group"
            >
              <div className="relative w-full h-48 bg-emerald-50">
                <ProductImage src={image} alt={title} fill className="object-cover" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
                    {category}
                  </span>
                  {date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {date}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition line-clamp-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3">{description}...</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}