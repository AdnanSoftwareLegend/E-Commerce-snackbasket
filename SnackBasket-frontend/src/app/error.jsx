'use client';

export default function Error({ error, reset }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-6xl font-black text-red-500">Oops!</h1>
      <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
      <p className="text-gray-500 max-w-md mx-auto text-sm">
        {error?.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        onClick={reset}
        className="inline-block bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm"
      >
        Try Again
      </button>
    </div>
  );
}