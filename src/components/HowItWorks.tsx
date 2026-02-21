export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container mx-auto px-6 py-8 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        How it works
      </h2>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
        {/* Step 1 */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            1. List or browse
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Create a listing in seconds or browse what other UoM students are
            selling.
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            2. Message & agree
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Chat with the buyer or seller, agree on a price, and pick a campus
            meetup spot.
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            3. Meet & exchange
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Meet on campus, hand over the item, and complete the transaction
            securely.
          </p>
        </div>
      </div>

      {/* Why Peersy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h4 className="text-white font-semibold mb-1">
            Verified students only
          </h4>
          <p className="text-gray-400 text-sm">
            Every user signs up with a @manchester.ac.uk email. No strangers.
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h4 className="text-white font-semibold mb-1">
            Fast campus delivery
          </h4>
          <p className="text-gray-400 text-sm">
            Meet on campus between classes. No shipping, no waiting days.
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
          <h4 className="text-white font-semibold mb-1">Built for students</h4>
          <p className="text-gray-400 text-sm">
            Textbooks, electronics, furniture — everything students actually
            need.
          </p>
        </div>
      </div>
    </section>
  );
}
