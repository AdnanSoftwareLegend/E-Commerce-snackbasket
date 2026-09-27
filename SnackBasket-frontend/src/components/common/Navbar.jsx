'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Home,
  Store,
  Newspaper,
  Phone,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const pageLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: Store },
  { href: '/blog', label: 'Blog', icon: Newspaper },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?keyword=${encodeURIComponent(q)}` : '/shop');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const linkClass = (href) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition h-9 ${
      pathname === href
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
    }`;

  const authLinks = user ? (
    <>
      <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={linkClass('/dashboard')}>
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </Link>
      <Link href="/account" onClick={() => setMobileOpen(false)} className={linkClass('/account')}>
        <User className="w-4 h-4" /> My Account
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition h-9 w-full text-left"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/login" onClick={() => setMobileOpen(false)} className={linkClass('/login')}>
        <LogIn className="w-4 h-4" /> Login
      </Link>
      <Link href="/register" onClick={() => setMobileOpen(false)} className={linkClass('/register')}>
        <UserPlus className="w-4 h-4" /> Register
      </Link>
    </>
  );

  const mobileLinks = (
    <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-1 bg-white text-gray-800">
      <div className="space-y-1">
        {pageLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === href ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700 hover:text-emerald-600'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">{authLinks}</div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      {/* 1. Full Width Top Bar */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white hover:text-amber-200 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Snack<span className="text-amber-300">Box</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for groceries, fruits, milk..."
              className="w-full pl-4 pr-10 py-2 rounded-full border-none focus:outline-none text-sm bg-white text-gray-800 placeholder-gray-400 shadow-inner"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-emerald-600" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-5">
            <Link href="/wishlist" className="relative text-white hover:text-amber-200 transition hidden md:block">
              <Heart className="w-6 h-6" />
            </Link>

            <Link href="/cart" className="relative text-white hover:text-amber-200 transition flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </div>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-white hover:text-amber-200 transition text-sm font-semibold"
                >
                  <span className="hidden lg:inline">{firstName}</span>
                  <div className="w-8 h-8 bg-white text-emerald-700 rounded-full flex items-center justify-center font-bold uppercase shadow">
                    {(user.name || 'U').charAt(0)}
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-11 w-48 bg-white border rounded-xl shadow-lg z-50 py-2 text-gray-800">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="pt-2 space-y-1">
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition">
                          <User className="w-4 h-4" /> My Account
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition w-full text-left">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-white hover:text-amber-200 transition" aria-label="Login">
                <User className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Desktop Nav */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="hidden md:flex items-center justify-between py-2">
          <div className="flex items-center gap-1">
            {pageLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1">{authLinks}</div>
        </nav>

        {/* Mobile Nav */}
        {mobileOpen && mobileLinks}
      </div>
    </header>
  );
}