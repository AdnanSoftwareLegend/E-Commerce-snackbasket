'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductImage from '@/components/common/ProductImage';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 0 : 0; // Free delivery matching design
  const estimatedTax = subtotal * 0.05; // 5% Estimated Tax
  const grandTotal = subtotal + deliveryFee + estimatedTax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Your Shopping Cart is Empty!</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added any groceries yet.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Breadcrumb */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
        <p className="text-xs text-emerald-800 font-medium">Home : Cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Table */}
        <div className="lg:col-span-2 bg-white border rounded-2xl overflow-hidden shadow-sm h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50 text-emerald-900 border-b text-sm font-semibold">
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {cartItems.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-16 h-16 border rounded-lg p-1 bg-white flex-shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-gray-400">By {item.vendor || 'Lucky Supermarket'}</p>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-700">${item.price.toFixed(2)}</td>

                    <td className="p-4">
                      <div className="flex items-center border rounded-lg w-fit bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-600 hover:text-emerald-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-semibold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:text-emerald-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-emerald-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart Totals Summary */}
        <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-emerald-100 pb-3">Cart Totals</h2>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Taxes</span>
              <span className="font-semibold text-gray-800">USD {estimatedTax.toFixed(2)}</span>
            </div>
          </div>

          <hr className="border-emerald-200" />

          <div className="flex justify-between text-base font-extrabold text-gray-900">
            <span>Total</span>
            <span className="text-emerald-700">${grandTotal.toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}