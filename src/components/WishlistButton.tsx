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
  // States
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  // Function in charge of adding / deleting a certain listing from the users wishlist
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
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`w-full sm:w-auto rounded-lg border px-6 py-3 font-medium transition-colors disabled:opacity-50 ${
        wishlisted
          ? 'border-purple-600 bg-purple-600/20 text-purple-300'
          : 'border-gray-700 text-white hover:bg-gray-800'
      }`}
    >
      {wishlisted ? '♥ In wishlist' : '♡ Add to wishlist'}
    </button>
  );
}
