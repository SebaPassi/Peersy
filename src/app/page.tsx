import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  // Supabase session management
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl text-purple-400">
            The University of Manchester
          </h1>
          {/* Main Headline */}
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            <span className="text-white">Buy & Sell with</span>
            <br />
            <span className="text-gradient-purple">Your Peers</span>
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            The trusted marketplace for University of Manchester students.
            Textbooks, electronics, furniture, and more.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-secondary text-lg px-8 py-4"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-secondary text-lg px-8 py-4">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Partner Logos Section */}
      <footer className="container mx-auto px-6 py-16 border-t border-gray-800">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {/* University of Manchester */}
          <div className="text-white font-semibold text-sm md:text-base">
            MANCHESTER
            <br />
            <span className="text-xs md:text-sm font-normal">
              1824 The University of Manchester
            </span>
          </div>

          {/* Placeholder for other partner logos */}
          <div className="text-gray-400 text-sm">VISA</div>
          <div className="text-gray-400 text-sm">accelerate me</div>
          <div className="text-gray-400 text-sm">DIGITAL ISLE OF MAN</div>
          <div className="text-gray-400 text-sm">Masood Enterprise Centre</div>
          <div className="text-gray-400 text-sm">foreverbeta</div>
        </div>
      </footer>
    </div>
  );
}
