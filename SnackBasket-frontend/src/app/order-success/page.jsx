import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 bg-white my-10 border rounded-3xl shadow-sm">
      <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
      <h1 className="text-2xl font-bold text-gray-800">Thank You for Your Order!</h1>
      <p className="text-gray-600 text-sm">
        Your order has been placed successfully. We are preparing your fresh groceries for express delivery.
      </p>
      <div className="pt-4 flex justify-center gap-4">
        <Link
          href="/shop"
          className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}