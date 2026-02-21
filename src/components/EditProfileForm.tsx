'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';
import Image from 'next/image';

export default function EditProfileForm({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  // Important states for the edit form
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Supabase
  const supabase = createClient();

  // Function to upload image
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      setError('Image must be smaller than 2 MB.');
      return;
    }

    setUploading(true);
    setError(null);

    const fileExt = file.name.split('.').pop();
    const filePath = `${profile.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    setAvatarUrl(publicUrlData.publicUrl);
    setUploading(false);
  }

  // Function that submits and save changes
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage('Profile updated.');

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Avatar
        </label>
        <div className="flex items-center gap-4 mb-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center text-xl font-bold text-purple-300">
              {fullName?.charAt(0)?.toUpperCase() ??
                email?.charAt(0)?.toUpperCase() ??
                '?'}
            </div>
          )}
          <label className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
            {uploading ? 'Uploading...' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-500 cursor-not-allowed"
        />
        <p className="text-gray-500 text-xs mt-1">Email cannot be changed.</p>
      </div>

      {/* Full name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-white mb-2"
        >
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          required
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save changes'}
      </button>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-green-400 bg-green-400/10 rounded-lg p-3">
          {message}
        </p>
      )}
    </form>
  );
}
