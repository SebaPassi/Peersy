import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import NewListingForm from '@/components/NewListingForm';

export const metadata = {
  title: 'New listing | Peersy',
  description: 'Create a new listing on Peersy',
};

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mb-8">
          Create a new listing
        </h1>
        <NewListingForm userId={user.id} />
      </div>
    </div>
  );
}
