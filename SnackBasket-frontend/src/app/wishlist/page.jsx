'use client';

import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductImage from '@/components/common/ProductImage';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Your wishlist is empty!</h2>
        <p className="text-gray-500 mt-2">Explore items and save your favorites here.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 border-b text-sm font-semibold">
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-center">Action</th>
                <th className="p-4 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {wishlistItems.map((product) => (
                <tr key={product._id || product.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 border rounded-lg p-1 bg-white flex-shrink-0">
                      <ProductImage
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-gray-400">{product.vendor || 'SnackBasket'}</p>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">${product.price}</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      In Stock
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add To Cart
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="text-red-500 hover:text-red-700 p-2 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}