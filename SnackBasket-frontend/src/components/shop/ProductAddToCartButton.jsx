'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductAddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const stock = product.stock && product.stock > 0 ? product.stock : 10;

  const handleAdd = () => addToCart(product, qty);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border rounded-xl bg-gray-50">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-gray-600 hover:text-emerald-600 transition"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-3 font-semibold text-sm">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="px-3 py-2 text-gray-600 hover:text-emerald-600 transition"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition inline-flex items-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" /> Add to Cart
      </button>

      <span className="text-xs text-gray-400">
        {stock > 0 ? `${stock} items in stock` : 'Out of stock'}
      </span>
    </div>
  );
}