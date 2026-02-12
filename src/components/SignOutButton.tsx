'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="bg-transparent border border-purple-600 text-white px-6 py-2.5 rounded-full font-medium text-sm uppercase tracking-wide transition-all hover:bg-purple-600/10 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
    >
      LOG OUT
    </button>
  );
}
