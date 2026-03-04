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
            <h2 className="text-xl font-bold text-white">My listings</h2>
            <Link
              href="/dashboard/listings/new"
              className="rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              New listing
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
            {myListings.length === 0 ? (
              <p className="text-gray-400">You haven’t listed anything yet.</p>
            ) : (
              <ul className="space-y-4">
                {myListings.map((listing) => (
                  <li
                    key={listing.id}
                    className="flex items-center justify-between gap-4 py-3 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <Link
                        href={`dashboard/listings/${listing.id}`}
                        className="font-medium text-white hover:text-purple-400"
                      >
                        {listing.title}
                      </Link>
                      <p className="text-gray-400 text-sm">
                        £{Number(listing.price).toFixed(2)} · {listing.status}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/listings/${listing.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-600/50 bg-purple-600/10 px-3 py-1.5 text-sm font-medium text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
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
          <h2 className="text-xl font-bold text-white mb-4">Wishlist</h2>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
            {wishlistItems.length === 0 ? (
              <p className="text-gray-400">Your wishlist is empty.</p>
            ) : (
              <ul className="space-y-4">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3 border-b border-gray-800 last:border-0"
                  >
                    {item.listings ? (
                      <>
                        <Link
                          href={`/listings/${item.listings.id}`}
                          className="font-medium text-white hover:text-purple-400"
                        >
                          {item.listings.title}
                        </Link>
                        <span className="text-gray-400 text-sm">
                          £{Number(item.listings.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Listing unavailable</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Reviews (as seller) */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Reviews about you
          </h2>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
            {myReviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {myReviews.map((review) => (
                  <li
                    key={review.id}
                    className="py-3 border-b border-gray-800 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-400 text-sm">{review.comment}</p>
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
