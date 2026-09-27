'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut,
  Package,
  Clock,
} from 'lucide-react';
import RequireAuth from '@/components/common/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/hooks/useOrders';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getOrderItems(order) {
  return order.items || order.orderItems || [];
}

function getOrderStatus(order) {
  return order.orderStatus || (order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Processing');
}

const statusStyles = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-600',
};

function AccountContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: orders, isLoading } = useOrders();
  const orderList = Array.isArray(orders) ? orders : [];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <h1 className="text-xl font-bold text-gray-800">My Account</h1>
        <p className="text-xs text-emerald-800 font-medium">Home : Account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="space-y-6 h-fit">
          {/* Profile Card */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold uppercase text-2xl">
                {(user?.name || 'U').charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{user?.name}</h2>
                <p className="text-xs text-gray-400 capitalize">{user?.role} account</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" /> {user?.email}
              </li>
              {user?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" /> {user.phone}
                </li>
              )}
              {user?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" /> {user.address}
                </li>
              )}
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> Member since{' '}
                {user?.createdAt ? formatDate(user.createdAt) : 'SnackBasket'}
              </li>
            </ul>

            <div className="mt-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                <User className="w-4 h-4" /> Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl transition text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 border-b pb-3 mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/shop" className="bg-gray-50 hover:bg-emerald-50 text-gray-700 py-2 rounded-lg text-center font-medium transition">Shop</Link>
              <Link href="/cart" className="bg-gray-50 hover:bg-emerald-50 text-gray-700 py-2 rounded-lg text-center font-medium transition">Cart</Link>
              <Link href="/wishlist" className="bg-gray-50 hover:bg-emerald-50 text-gray-700 py-2 rounded-lg text-center font-medium transition">Wishlist</Link>
              <Link href="/contact" className="bg-gray-50 hover:bg-emerald-50 text-gray-700 py-2 rounded-lg text-center font-medium transition">Contact</Link>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm h-fit">
          <div className="flex items-center gap-2 p-6 pb-3">
            <Package className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-gray-800">Order History</h3>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orderList.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
              <Link
                href="/shop"
                className="inline-block mt-3 text-sm bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-emerald-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-900 border-b text-xs font-semibold">
                    <th className="p-4">Order</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {orderList.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-xs text-gray-700">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4 text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{getOrderItems(order).length}</td>
                      <td className="p-4 font-bold text-emerald-600">
                        ${Number(order.totalAmount ?? order.totalPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            statusStyles[getOrderStatus(order)] || 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {getOrderStatus(order)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountContent />
    </RequireAuth>
  );
}
