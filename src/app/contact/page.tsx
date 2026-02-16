import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact | Peersy',
  description: 'Get in touch with the Peersy team',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact us
          </h1>
          <p className="text-gray-400 mb-10">
            Have a question or feedback? Send us a message and we’ll get back to
            you as soon as we can.
          </p>

          <ContactForm />

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              You can also check our{' '}
              <Link
                href="/#faq"
                className="text-purple-400 hover:text-purple-300"
              >
                FAQ
              </Link>{' '}
              for quick answers to common questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
