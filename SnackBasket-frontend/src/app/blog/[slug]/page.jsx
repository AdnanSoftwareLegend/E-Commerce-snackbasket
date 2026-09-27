import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import ProductImage from '@/components/common/ProductImage';
import { getBlogs, getBlogBySlug } from '@/services/blogService';

export const dynamic = 'force-dynamic';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = params;
  let blog = null;
  let recentPosts = [];

  try {
    blog = await getBlogBySlug(slug);
  } catch (error) {
    console.error('Blog load korte somossha hoyeche:', error.message);
  }

  if (!blog) {
    console.error('Blog not found:', slug);
  }

  try {
    const blogs = await getBlogs();
    if (Array.isArray(blogs)) {
      recentPosts = blogs
        .filter((b) => b.slug !== slug)
        .slice(0, 3)
        .map((b) => ({
          slug: b.slug,
          title: b.title,
          date: b.createdAt ? formatDate(b.createdAt) : '',
          image: b.image,
        }));
    }
  } catch (error) {
    console.error('Recent blogs load korte somossha hoyeche:', error.message);
  }

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Blog post not found</h1>
        <p className="text-gray-500 text-sm mt-2">The article you are looking for does not exist.</p>
        <Link
          href="/blog"
          className="inline-block mt-6 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const paragraphs = String(blog.content || '').split(/\n\s*\n|\r\n\s*\r\n/).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <Link
          href="/blog"
          className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>
        <p className="text-xs text-emerald-800 font-medium whitespace-nowrap">Home : Blog Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Article Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border bg-emerald-50">
            <ProductImage src={blog.image || '/images/placeholder.svg'} alt={blog.title} fill className="object-cover" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
                {blog.category || 'Grocery'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Published on {blog.date || formatDate(blog.createdAt)}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{blog.title}</h2>

            {paragraphs.length ? (
              paragraphs.map((para, idx) => (
                <p key={idx} className="text-sm text-gray-600 leading-relaxed">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{blog.content}</p>
            )}
          </div>
        </div>

        {/* Recent Posts Sidebar */}
        <div className="border p-6 rounded-2xl bg-white h-fit space-y-4">
          <h3 className="font-bold text-gray-800 border-b pb-3">Recent Posts</h3>

          {recentPosts.length ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-3 group items-center">
                  <div className="relative w-16 h-16 bg-emerald-50 rounded-lg overflow-hidden flex-shrink-0">
                    <ProductImage src={post.image || '/images/placeholder.svg'} alt={post.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 group-hover:text-emerald-600 line-clamp-2 transition">
                      {post.title}
                    </h4>
                    {post.date && <span className="text-[10px] text-gray-400 mt-1 block">{post.date}</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No other posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}