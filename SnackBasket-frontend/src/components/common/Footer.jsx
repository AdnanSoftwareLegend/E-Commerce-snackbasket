import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand & Address */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="text-2xl font-black text-emerald-600">
            Snack<span className="text-amber-500">Box</span>
          </Link>
          <p className="text-xs text-gray-500 max-w-sm">
            We're Grocery Shop, an innovative team of food suppliers offering fresh products delivered right to your doorstep.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>789 Inner Lane, Biyes park, California</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>+00 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Example@site.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Information</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/register" className="hover:text-emerald-600">Become a Vendor</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-600">Affiliate Program</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-600">Privacy Policy</Link></li>
            <li><Link href="/shop" className="hover:text-emerald-600">Our Suppliers</Link></li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Account</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/account" className="hover:text-emerald-600">My Account</Link></li>
            <li><Link href="/dashboard" className="hover:text-emerald-600">Dashboard</Link></li>
            <li><Link href="/cart" className="hover:text-emerald-600">Shopping Cart</Link></li>
            <li><Link href="/wishlist" className="hover:text-emerald-600">Wishlist</Link></li>
            <li><Link href="/login" className="hover:text-emerald-600">Login</Link></li>
            <li><Link href="/register" className="hover:text-emerald-600">Register</Link></li>
          </ul>
        </div>

        {/* Groceries */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Groceries</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shop" className="hover:text-emerald-600">Dairy & Eggs</Link></li>
            <li><Link href="/shop" className="hover:text-emerald-600">Meat & Seafood</Link></li>
            <li><Link href="/shop" className="hover:text-emerald-600">Breakfast Food</Link></li>
            <li><Link href="/shop" className="hover:text-emerald-600">Pantry Staples</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border-t border-emerald-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>©2026. All Rights Reserved By SnackBasket</p>
          <p>Secure Payment Options Supported</p>
        </div>
      </div>
    </footer>
  );
}