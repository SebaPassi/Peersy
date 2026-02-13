'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isAllowedEmail, ALLOWED_EMAIL_MESSAGE } from '@/lib/auth';

export default function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Supabase
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation of email before creating account and calling supabase
    if (!isAllowedEmail(email)) {
      setError(ALLOWED_EMAIL_MESSAGE);
      return;
    }

    setLoading(true);

    // Supabase
    const supabase = createClient();

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setMessage('Account created. Check your email to confirm');

    // Debugging purposes
    console.log({ data });

    // router.refresh();
    // router.push('/');
    window.location.href = '/';
  };

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="inline-block text-gray-400 hover:text-white transition-colors mb-8"
      >
        Back home →
      </Link>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-xl">
        <p className="text-gray-400 text-sm mb-1">CREDENTIALS</p>
        <h1 className="text-2xl font-bold text-white mb-8">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 mb-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-white mb-2"
            >
              Full name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@student.manchester.ac.uk"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Sign up'}
          </button>
        </form>

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

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="text-purple-400 hover:text-purple-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
