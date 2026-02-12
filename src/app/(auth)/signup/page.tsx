import SignUpForm from "@/components/SignUpForm";

export const metadata = {
  title: "Sign up | Peersy",
  description: "Create your Peersy account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-12 max-w-4xl w-full">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Create an account</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Use your @student.manchester.ac.uk email to join the marketplace. We’ll handle security and keep your session in sync.
          </p>
          <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Enter your student email and choose a password.</li>
            <li>Submit to create your account.</li>
            <li>Already have an account? <a href="/login" className="font-bold text-white">Sign in</a>.</li>
          </ol>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}