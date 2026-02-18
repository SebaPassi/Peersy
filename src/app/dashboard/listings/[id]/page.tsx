import Link from 'next/link';

export default function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Listing detail</h1>
        <p className="text-gray-400">
          Listing {params.id} – detail view coming soon.
        </p>
      </div>
    </div>
  );
}
