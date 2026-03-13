'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function WishlistButton({
  listingId,
  initialWishlisted,
}: {
  listingId: string;
  initialWishlisted: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();

    if (wishlisted) {
      await supabase.from('wishlists').delete().eq('listing_id', listingId);
      setWishlisted(false);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('wishlists').insert({
          user_id: user.id,
          listing_id: listingId,
        });
        setWishlisted(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 hover:cursor-pointer ${
        wishlisted
          ? 'border-pink-500/60 bg-pink-500/15 text-pink-400 hover:bg-pink-500/25'
          : 'border-gray-700 text-gray-300 hover:border-purple-500/50 hover:text-white hover:bg-purple-600/10'
      }`}
    >
      {/* SVG heart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={wishlisted ? 0 : 1.5}
        stroke="currentColor"
        fill={wishlisted ? 'currentColor' : 'none'}
        className={`h-5 w-5 transition-transform duration-200 ${
          animate ? 'scale-125' : 'scale-100'
        } ${wishlisted ? 'text-pink-400' : 'group-hover:text-purple-400'}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>

      {/* Label */}
      <span>
        {loading
          ? 'Updating...'
          : wishlisted
            ? 'In wishlist'
            : 'Add to wishlist'}
      </span>
    </button>
  );
}
