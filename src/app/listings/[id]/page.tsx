import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Listing, Profile } from '@/types/database';
import WishlistButton from '@/components/WishlistButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('title')
    .eq('id', id)
    .single();

  return {
    title: listing ? `${listing.title} | Peersy` : 'Listing | Peersy',
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  // If the listing wasn't found
  if (!listing) {
    notFound();
  }

  // Telling typescript that: "Trust me, this matches my Listing Type"
  const typedListing = listing as Listing;

  // Fetch seller of the product
  const { data: seller } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', typedListing.seller_id)
    .single();

  const sellerData = seller as Pick<
    Profile,
    'id' | 'full_name' | 'avatar_url'
  > | null;

  // Gets the current user (is there someone logged in?)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Wishlist logic
  let isWishlisted = false;
  if (user) {
    const { data: wishlistRow } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', id)
      .maybeSingle();
    isWishlisted = !!wishlistRow; // Converts null -> false and object -> true
  }

  // Checks if the current user is the owner of the product
  const isOwner = user?.id === typedListing.seller_id;

  const conditionLabels: Record<string, string> = {
    new: 'New',
    like_new: 'Like new',
    good: 'Good',
    fair: 'Fair',
  };

  // Component to be rendered
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-start gap-1 mb-8">
          <Link
            href="/dashboard"
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to dashboard
          </Link>
          <Link
            href="/explore"
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to explore
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            {typedListing.images.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-800 overflow-hidden bg-gray-900/60">
                  <Image
                    src={typedListing.images[0]}
                    alt={typedListing.title}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {typedListing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {typedListing.images.slice(1).map((img, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-800 overflow-hidden bg-gray-900/60"
                      >
                        <Image
                          src={img}
                          alt={`${typedListing.title} - ${i + 2}`}
                          width={150}
                          height={150}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 flex items-center justify-center h-80">
                <span className="text-gray-500">No images</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-400 uppercase tracking-wide">
                {typedListing.category}
              </span>
              <span className="text-gray-700">·</span>
              <span className="text-sm text-gray-400">
                {conditionLabels[typedListing.condition] ??
                  typedListing.condition}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {typedListing.title}
            </h1>

            <p className="text-3xl font-bold text-purple-400 mb-6">
              £{Number(typedListing.price).toFixed(2)}
            </p>

            {typedListing.status !== 'active' && (
              <span className="inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium bg-red-400/10 text-red-400">
                {typedListing.status === 'sold' ? 'Sold' : 'Removed'}
              </span>
            )}

            {typedListing.description && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-white mb-2">
                  Description
                </h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {typedListing.description}
                </p>
              </div>
            )}

            {typedListing.location && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-white mb-1">
                  Meetup location
                </h2>
                <p className="text-gray-400">{typedListing.location}</p>
              </div>
            )}

            <p className="text-gray-500 text-sm mb-8">
              Listed {new Date(typedListing.created_at).toLocaleDateString()}
            </p>

            {/* Actions */}
            {user && !isOwner && typedListing.status === 'active' && (
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href={`/messages?listing=${typedListing.id}&seller=${typedListing.seller_id}`}
                  className="w-full sm:w-auto text-center rounded-lg bg-purple-600 text-white px-6 py-3 font-medium hover:bg-purple-700 transition-colors"
                >
                  Message seller
                </Link>
                <WishlistButton
                  listingId={typedListing.id}
                  initialWishlisted={isWishlisted}
                />
              </div>
            )}

            {isOwner && (
              <Link
                href={`/dashboard/listings/${typedListing.id}/edit`}
                className="inline-block rounded-lg border border-purple-600 text-white px-6 py-3 font-medium hover:bg-purple-600/20 transition-colors mb-8"
              >
                Edit listing
              </Link>
            )}

            {!user && typedListing.status === 'active' && (
              <p className="text-gray-400 text-sm mb-8">
                <Link
                  href="/signin"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </Link>{' '}
                to message the seller or add to your wishlist.
              </p>
            )}

            {/* Seller card */}
            {sellerData && (
              <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
                <h2 className="text-sm font-semibold text-white mb-3">
                  Seller
                </h2>
                <div className="flex items-center gap-3">
                  {sellerData.avatar_url ? (
                    <Image
                      src={sellerData.avatar_url}
                      alt={sellerData.full_name ?? 'Seller'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-sm font-bold text-purple-300">
                      {sellerData.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {sellerData.full_name ?? 'Anonymous'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
