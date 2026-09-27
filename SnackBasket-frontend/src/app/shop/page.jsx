'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';

function ShopContent() {
  const searchParams = useSearchParams();
  const urlKeyword = searchParams.get('keyword') || '';
  const urlCategory = searchParams.get('category') || '';

  const [keyword, setKeyword] = useState(urlKeyword);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [priceRange, setPriceRange] = useState(200);

  useEffect(() => {
    setKeyword(urlKeyword);
    setSelectedCategory(urlCategory);
  }, [urlKeyword, urlCategory]);

  const { data: categories } = useCategories();
  const { data: productsData, isLoading, isError } = useProducts({
    keyword: keyword || undefined,
    category: selectedCategory || undefined,
    maxPrice: priceRange < 200 ? priceRange : undefined,
  });

  const products = productsData?.products || productsData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <h1 className="text-xl font-bold text-gray-800">Shop</h1>
        <p className="text-xs text-emerald-800 font-medium">Home : Shop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6 border p-6 rounded-2xl bg-white h-fit">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm bg-gray-50"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Product Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left text-sm py-1 ${!selectedCategory ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id || cat.id}
                  onClick={() => setSelectedCategory(cat.slug || cat.name)}
                  className={`block w-full text-left text-sm py-1 ${selectedCategory === (cat.slug || cat.name) ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">
              Price: Up to ${priceRange === 200 ? 'All' : priceRange}
            </h3>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3">
          {/* Active Filters */}
          {(keyword || selectedCategory) && (
            <div className="mb-4 text-sm">
              <span className="text-gray-500">
                Showing results
                {keyword && (
                  <>
                    {' '}for <strong className="text-emerald-600">"{keyword}"</strong>
                  </>
                )}
              </span>
              <button
                onClick={() => {
                  setKeyword('');
                  setSelectedCategory('');
                }}
                className="ml-3 text-xs text-red-500 hover:underline font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500">Failed to load products</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-2xl">
              <h3 className="text-lg font-bold text-gray-700">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or removing filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}