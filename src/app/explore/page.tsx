import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Listing } from '@/types/database';
import ExploreFilters from '@/components/ExploreFilters';

export const metadata = {
  title: 'Explore | Peersy',
  description: 'Browse student listings on Peersy',
};

const PAGE_SIZE = 12;

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like new',
  good: 'Good',
  fair: 'Fair',
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Example of an url -> "/explore?q=book&category=Textbooks&page=2"
  const params = await searchParams;

  // To prevent type errors
  const q = typeof params.q === 'string' ? params.q : ''; // search string
  const category = typeof params.category === 'string' ? params.category : ''; // category
  const condition =
    typeof params.condition === 'string' ? params.condition : ''; // condition
  const minPrice = typeof params.min_price === 'string' ? params.min_price : ''; // minPrice
  const maxPrice = typeof params.max_price === 'string' ? params.max_price : ''; // maxPrice
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'; // sort
  const page = Math.max(1, Number(params.page) || 1); // page

  // Supabase
  const supabase = await createClient();

  // Database query construction (it gets all the active listings on the db. It also returns the tota number for pagination)
  let query = supabase
    .from('listings')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  // FILTERS ADDITION TO QUERY
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`); // SQL -> WHERE title ILIKE '%book%' OR description ILIKE '%book%'
  }

  // Apply category and condition filters
  if (category) query = query.eq('category', category);
  if (condition) query = query.eq('condition', condition);

  // Apply price range filters
  const parsedMin = parseFloat(minPrice);
  const parsedMax = parseFloat(maxPrice);
  if (!isNaN(parsedMin)) query = query.gte('price', parsedMin);
  if (!isNaN(parsedMax)) query = query.lte('price', parsedMax);

  // Apply sort (if not, by date created)
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Efficient db-level pagination (only fetch the necessary listings for that specific page)
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  // Result of query
  const { data, count } = await query;

  const listings = (data ?? []) as Listing[];
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Build base URL for pagination links
  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (category) sp.set('category', category);
    if (condition) sp.set('condition', condition);
    if (minPrice) sp.set('min_price', minPrice);
    if (maxPrice) sp.set('max_price', maxPrice);
    if (sort && sort !== 'newest') sp.set('sort', sort);
    if (p > 1) sp.set('page', String(p));
    const qs = sp.toString();
    return `/explore${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Explore listings
        </h1>
        <p className="text-gray-400 mb-5">
          Your next great find is one search away!
        </p>

        {/* Filters */}
        <ExploreFilters />

        {/* Results count */}
        <p className="text-sm text-gray-400 mt-6 mb-4">
          {totalCount} listing{totalCount !== 1 ? 's' : ''} found
        </p>

        {/* Listing grid */}
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-12 text-center">
            <p className="text-gray-400 text-lg">
              No listings match your filters.
            </p>
            <Link
              href="/explore"
              className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/listings/${listing.id}`}
                className="group rounded-2xl border border-gray-800 bg-gray-900/80 overflow-hidden hover:border-purple-600/50 transition-colors"
              >
                {/* Thumbnail */}
                <div className="aspect-square relative bg-gray-800">
                  {listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No image
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-bold text-purple-400 mt-1">
                    £{Number(listing.price).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                      {listing.category}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                      {conditionLabels[listing.condition] ?? listing.condition}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-10">
            {/* Previous */}
            {page > 1 ? (
              <Link
                href={pageUrl(page - 1)}
                className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-purple-500 hover:text-white transition-colors"
              >
                ← Prev
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-800 px-3 py-2 text-sm text-gray-600 cursor-not-allowed">
                ← Prev
              </span>
            )}

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 2 && p <= page + 2),
              )
              .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) {
                  acc.push('ellipsis');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === 'ellipsis' ? (
                  <span key={`e-${i}`} className="text-gray-600 px-1">
                    ...
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={pageUrl(item)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item === page
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white'
                    }`}
                  >
                    {item}
                  </Link>
                ),
              )}

            {/* Next */}
            {page < totalPages ? (
              <Link
                href={pageUrl(page + 1)}
                className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-purple-500 hover:text-white transition-colors"
              >
                Next →
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-800 px-3 py-2 text-sm text-gray-600 cursor-not-allowed">
                Next →
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
