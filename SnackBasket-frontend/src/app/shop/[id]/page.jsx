import Link from 'next/link';
import { Star, Package, ArrowLeft } from 'lucide-react';
import { getProductById } from '@/services/productService';
import ProductImage from '@/components/common/ProductImage';
import ProductAddToCartButton from '@/components/shop/ProductAddToCartButton';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  const { id } = params;
  let product = null;

  try {
    const res = await getProductById(id);
    product = res.data || res;
  } catch (error) {
    console.error('Product details load korte somossha hoyeche:', error);
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        <p className="text-gray-500 text-sm mt-2">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-6 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof product.category === 'object' && product.category?.name
      ? product.category.name
      : product.category || 'Grocery';
  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <Link href="/shop" className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
        <p className="text-xs text-emerald-800 font-medium whitespace-nowrap">Home : Shop : Product Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="border rounded-2xl p-6 flex items-center justify-center bg-gray-50 h-fit">
          <div className="relative w-full h-80">
            <ProductImage src={product.image} alt={product.title} fill className="object-contain" />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {categoryName}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-3">{product.title}</h1>
            {product.vendor && <p className="text-sm text-gray-400 mt-1">By {product.vendor}</p>}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(product.rating || 4.5)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating || '4.5'} ({product.numReviews || 0} reviews)
            </span>
            {product.discount > 0 && (
              <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-emerald-600">${product.price}</span>
            {product.oldPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">${product.oldPrice}</span>
            )}
          </div>

          {/* Stock */}
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              inStock ? 'text-emerald-700' : 'text-red-500'
            }`}
          >
            <Package className="w-4 h-4" />
            {inStock ? `${product.stock} items in stock` : 'Out of stock'}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Add to Cart */}
          <div className="pt-4 border-t border-gray-100">
            <ProductAddToCartButton product={product} />
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            {[
              { label: 'Free Delivery', icon: '🚚' },
              { label: 'Easy Returns', icon: '↩️' },
              { label: 'Secure Payment', icon: '🔒' },
            ].map(({ label, icon }) => (
              <div key={label} className="bg-emerald-50 rounded-xl py-3">
                <span className="text-xl">{icon}</span>
                <p className="text-xs font-semibold text-emerald-700 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}