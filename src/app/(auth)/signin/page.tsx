import SignInForm from '@/components/SignInForm';

export const metadata = {
  title: 'Sign in | Peersy',
  description: 'Sign in to Peersy',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-12 max-w-4xl w-full">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            UoM Email + Password
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Sign in with your your @manchester.ac.uk email. We’ll handle
            security and keep your session in sync.
          </p>
          <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Enter your student email and password.</li>
            <li>Submit to sign in</li>
            <li>
              New here? Use the{' '}
              <a href="/signup" className="font-bold text-white">
                Sign up
              </a>{' '}
              page to create an account.
            </li>
          </ol>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
