'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductImage from '@/components/common/ProductImage';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const productId = product._id || product.id;
  const wished = isInWishlist(productId);

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-lg transition duration-200 relative group flex flex-col justify-between">
      <div>
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 z-10 p-1.5 bg-gray-50 rounded-full transition ${
            wished ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-4 h-4" fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* Product Image */}
        <Link href={`/shop/${productId}`} className="block relative w-full h-40 my-2">
          <ProductImage
            src={product.image}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition duration-300"
          />
        </Link>

        {/* Title & Category */}
        <span className="text-xs text-gray-400 font-medium">
          {typeof product.category === 'object' && product.category?.name
            ? product.category.name
            : product.category || 'Grocery'}
        </span>
        <Link href={`/shop/${productId}`}>
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-emerald-600 transition my-1">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* Price & Add to Cart */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
        <div>
          <span className="text-base font-bold text-emerald-600">${product.price}</span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through ml-2">${product.oldPrice}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white p-2 rounded-xl transition flex items-center justify-center"
          title="Add to Cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}