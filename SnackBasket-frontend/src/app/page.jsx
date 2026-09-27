


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Truck, RotateCcw, ShieldCheck, ArrowRight, Sparkles, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import ProductImage from '@/components/common/ProductImage';
import { useProducts, useCategories } from '@/hooks/useProducts';

// Full width auto-swapping slides
const middleSlides = [
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80',
    tag: '100% Organic Essentials',
    title: 'Fresh Groceries,\nDelivered in Minutes',
    desc: 'Order farm-fresh produce, daily essentials and organic snacks right to your doorstep.',
  },
  {
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1920&q=80',
    tag: 'Handpicked Everyday',
    title: 'Farm Fresh Fruits\n& Garden Vegetables',
    desc: 'Directly sourced from trusted local farmers with zero chemical preservatives.',
  },
  {
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1920&q=80',
    tag: 'Super Express Shipping',
    title: 'Quick Pantry Refill\nAt Lowest Prices',
    desc: 'Get exclusive discounts on monthly pantry items and international snack brands.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506617429158-171e54d45840?auto=format&fit=crop&w=1920&q=80',
    tag: 'Crisp & Delicious',
    title: 'Freshly Baked Goods\n& Morning Dairy',
    desc: 'Start your morning with fresh milk, artisan bread, and artisanal cheese spreads.',
  },
  {
    image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=1920&q=80',
    tag: 'Daily Mega Savings',
    title: 'Up To 40% Off On\nWeekly Grocery Deals',
    desc: 'Enjoy unmatched prices and reward points on every single purchase today.',
  },
];

const features = [
  { icon: Truck, title: 'Express Delivery', desc: 'Same-day delivery across the city' },
  { icon: Smartphone, title: 'Easy Ordering', desc: 'Shop in just a few taps' },
  { icon: RotateCcw, title: 'Easy Returns', desc: 'No questions asked returns' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% safe checkout' },
];

export default function HomePage() {
  const { data: categories } = useCategories();
  const { data: productsData, isLoading, isError } = useProducts({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const products = productsData?.products || productsData || [];
  const featured = products.slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % middleSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? middleSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % middleSlides.length);
  };

  return (
    <div className="bg-gray-50/50">
      {/* ================= EDGE-TO-EDGE FULL SCREEN HERO BANNER ================= */}
      <section className="w-full relative overflow-hidden bg-emerald-950 min-h-[520px] md:min-h-[620px] flex items-center justify-center">
        
        {/* Background Slides */}
        {middleSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIdx
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              unoptimized
            />
            {/* Dark Overlay for clear text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-emerald-950/65 to-black/40" />
          </div>
        ))}

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          className="absolute left-6 z-30 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all hidden sm:flex items-center justify-center shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-6 z-30 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all hidden sm:flex items-center justify-center shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Main Content */}
        <div className="relative z-20 text-center text-white px-6 py-16 md:px-12 max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{middleSlides[currentIdx].tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white drop-shadow-xl whitespace-pre-line">
            {middleSlides[currentIdx].title}
          </h1>

          <p className="text-sm sm:text-lg text-gray-200 max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
            {middleSlides[currentIdx].desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-full shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all text-base"
            >
              <ShoppingCart className="w-5 h-5" /> Shop Now
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-full border border-white/25 backdrop-blur-md hover:-translate-y-0.5 transition-all text-base"
            >
              Read Blog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-2.5 pt-6">
            {middleSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIdx
                    ? 'w-10 bg-amber-400 shadow-lg shadow-amber-400/50'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">Explore top quality grocery essentials</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-bold group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories?.length ? (
            categories.map((cat) => (
              <Link
                key={cat._id || cat.id}
                href={`/shop${cat.slug ? `?category=${cat.slug}` : ''}`}
                className="group bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-2xl bg-emerald-50 group-hover:scale-105 transition-transform duration-300">
                  <ProductImage src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 font-bold text-gray-800 text-base group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-sm text-gray-500 py-8">
              No categories available yet.
            </p>
          )}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked best sellers for you</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-bold group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 bg-gray-200/70 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 font-medium">Failed to load products</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ================= FEATURES BAR ================= */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 group">
              <div className="p-3.5 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 transition-colors duration-300">
                <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">{title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}