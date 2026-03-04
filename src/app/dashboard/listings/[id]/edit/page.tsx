import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EditListingForm from '@/components/EditListingForm';
import type { Listing } from '@/types/database';

export const metadata = {
  title: 'Edit listing | Peersy',
  description: 'Edit your listing on Peersy',
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/signin');

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (!listing) notFound();

  // Only the owner can edit
  if (listing.seller_id !== user.id) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mb-8">Edit listing</h1>
        <EditListingForm listing={listing as Listing} />
      </div>
    </div>
  );
}
