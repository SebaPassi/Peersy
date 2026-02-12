import Link from 'next/link';
import Logo from './Logo';
import SignOutButton from './SignOutButton';

export default function Header({ user }: { user: { id: string } | null }) {
  return (
    <header className="container mx-auto px-6 py-6 flex items-center justify-between">
      {/* Logo */}
      <Logo />

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className="text-white hover:text-purple-400 transition-colors font-medium"
        >
          HOME
        </Link>
        <Link
          href="/"
          className="text-white hover:text-purple-400 transition-colors font-medium"
        >
          CATEGORIES
        </Link>
        <Link
          href="/press"
          className="text-white hover:text-purple-400 transition-colors font-medium"
        >
          HOW IT WORKS
        </Link>
      </nav>

      {/* Sign Up / Log in / Log out */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="text-white hover:text-purple-400 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              DASHBOARD
            </Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="bg-transparent border border-purple-600 text-white px-6 py-2.5 rounded-full font-medium text-sm uppercase tracking-wide transition-all hover:bg-purple-600/10 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] relative"
            >
              SIGN UP
            </Link>
            <Link
              href="/signin"
              className="text-white hover:text-purple-400 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              SIGN IN
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
