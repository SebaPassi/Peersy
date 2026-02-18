import Link from 'next/link';

export default function NewListingPage() {
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mb-4">New listing</h1>
        <p className="text-gray-400">Create listing form coming soon.</p>
      </div>
    </div>
  );
}
