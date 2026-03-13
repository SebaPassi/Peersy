import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Listing, Wishlist, Review } from '@/types/database';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image';

export const metadata = {
  title: 'Dashboard | Peersy',
  description: 'Your Peersy dashboard',
};

// SERVER COMPONENT
export default async function DashboardPage() {
  // Supabase
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // If a user is signed in, then continue...
  // Promise.all: start all 4 queries at the same time, waits that ALL of them finish and saves the result in an array.
  const [
    { data: profile },
    { data: listings },
    { data: wishlistRows },
    { data: reviews },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('wishlists').select('*, listings(*)').eq('user_id', user.id),
    supabase.from('reviews').select('*').eq('reviewee_id', user.id),
  ]);

  const profileData = profile as Profile | null;
  const myListings = (listings ?? []) as Listing[];
  const wishlistItems = (wishlistRows ?? []) as (Wishlist & {
    listings: Listing | null;
  })[];
  const myReviews = (reviews ?? []) as Review[];

  const reviewCount = myReviews.length;
  const averageRating =
    reviewCount > 0
      ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(
          1,
        )
      : null;

  const conditionLabels: Record<string, string> = {
    new: 'New',
    like_new: 'Like new',
    good: 'Good',
    fair: 'Fair',
  };

  // The component that will be rendered
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        {/* Profile header */}
        <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {profileData?.avatar_url ? (
                <Image
                  src={profileData.avatar_url}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center text-2xl font-bold text-purple-300">
                  {profileData?.full_name?.charAt(0)?.toUpperCase() ??
                    user.email?.charAt(0)?.toUpperCase() ??
                    '?'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {profileData?.full_name ?? 'My profile'}
                </h1>
                <p className="text-gray-400">{user.email}</p>
                {averageRating !== null && (
                  <p className="text-purple-400 text-sm mt-1">
                    Seller rating: {averageRating} ({reviewCount} review
                    {reviewCount !== 1 ? 's' : ''})
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/edit"
              className="rounded-lg border border-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-600/20 transition-colors"
            >
              Edit profile
            </Link>
          </div>
        </section>

        {/* My listings */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">My listings</h2>
              <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                {myListings.length}
              </span>
            </div>
            <Link
              href="/dashboard/listings/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New listing
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
            {myListings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 mb-1">
                  {"You haven't listed anything yet."}
                </p>
                <p className="text-gray-500 text-sm">
                  Start selling to your peers!
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {myListings.map((listing) => (
                  <li
                    key={listing.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-800/40 p-3 hover:border-gray-700 transition-colors"
                  >
                    <Link href={`/listings/${listing.id}`} className="shrink-0">
                      {listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          width={72}
                          height={72}
                          className="w-[72px] h-[72px] rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-[72px] h-[72px] rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                          No img
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="font-medium text-white hover:text-purple-400 transition-colors truncate"
                      >
                        {listing.title}
                      </Link>
                      <p className="text-purple-400 font-semibold text-sm mt-0.5">
                        £{Number(listing.price).toFixed(2)}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            listing.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : listing.status === 'sold'
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                          {listing.category}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                          {conditionLabels[listing.condition] ??
                            listing.condition}
                        </span>
                        <span className="text-gray-700 text-xs">·</span>
                        <span className="text-xs text-gray-500">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/listings/${listing.id}/edit`}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-purple-600/50 bg-purple-600/10 px-3 py-1.5 text-sm font-medium text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Wishlist */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-white">Wishlist</h2>
            <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-400">
              {wishlistItems.length}
            </span>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 mb-1">Your wishlist is empty.</p>
                <p className="text-gray-500 text-sm">
                  Browse the{' '}
                  <Link
                    href="/explore"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    marketplace
                  </Link>{' '}
                  and save items you like!
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-800/40 p-3 hover:border-gray-700 transition-colors"
                  >
                    {item.listings ? (
                      <>
                        <Link
                          href={`/listings/${item.listings.id}`}
                          className="shrink-0"
                        >
                          {item.listings.images.length > 0 ? (
                            <Image
                              src={item.listings.images[0]}
                              alt={item.listings.title}
                              width={72}
                              height={72}
                              className="w-[72px] h-[72px] rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-[72px] h-[72px] rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                              No img
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/listings/${item.listings.id}`}
                            className="font-medium text-white hover:text-purple-400 transition-colors truncate shrink-0"
                          >
                            {item.listings.title}
                          </Link>
                          <p className="text-purple-400 font-semibold text-sm mt-0.5">
                            £{Number(item.listings.price).toFixed(2)}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                item.listings.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : item.listings.status === 'sold'
                                    ? 'bg-amber-500/15 text-amber-400'
                                    : 'bg-red-500/15 text-red-400'
                              }`}
                            >
                              {item.listings.status.charAt(0).toUpperCase() +
                                item.listings.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                              {item.listings.category}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                              {conditionLabels[item.listings.condition] ??
                                item.listings.condition}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/listings/${item.listings.id}`}
                          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-purple-600/50 bg-purple-600/10 px-3 py-1.5 text-sm font-medium text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          View
                        </Link>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-[72px] h-[72px] rounded-lg bg-gray-700/50 flex items-center justify-center shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-500 text-sm">
                          This listing is no longer available
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Reviews (as seller) */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-white">Reviews about you</h2>
            <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-400">
              {myReviews.length}
            </span>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
            {myReviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 mb-1">No reviews yet.</p>
                <p className="text-gray-500 text-sm">
                  Reviews will appear here after you complete sales.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {myReviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-xl border border-gray-800 bg-gray-800/40 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-400 tracking-wide">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment ? (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No comment left.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
