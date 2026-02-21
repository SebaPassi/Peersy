import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';
import EditProfileForm from '@/components/EditProfileForm';

export const metadata = {
  title: 'Edit profile | Peersy',
  description: 'Edit your Peersy profile',
};

export default async function EditProfilePage() {
  // Supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay user, se redirecciona a la página de SignIn
  if (!user) {
    redirect('/signin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Componente como tal
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">Edit profile</h1>

        <EditProfileForm
          profile={profile as Profile}
          email={user.email ?? ''}
        />
      </div>
    </div>
  );
}
