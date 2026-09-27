import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-6xl font-black text-emerald-600">404</h1>
      <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mx-auto text-sm">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block mt-4 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}