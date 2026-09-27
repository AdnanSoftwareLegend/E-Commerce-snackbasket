'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/orderService';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + 10; // Tax/Shipping fee included

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      customerDetails: formData,
      items: cartItems,
      totalAmount: total,
    };

    try {
      await createOrder(orderPayload);
      alert('Order placed successfully!');
      router.push('/order-success');
    } catch (error) {
      alert(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 border p-6 rounded-2xl bg-white">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        
        <input
          type="text"
          placeholder="Full Name"
          required
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            required
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Delivery Address"
          required
          rows={3}
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          {loading ? 'Processing Order...' : `Place Order ($${total.toFixed(2)})`}
        </button>
      </form>

      {/* Order Summary */}
      <div className="border p-6 rounded-2xl bg-gray-50 h-fit space-y-4">
        <h3 className="font-bold text-lg">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.title} x {item.quantity}</span>
            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-emerald-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}