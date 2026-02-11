import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-10 h-10 relative">
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield background for security */}
          <path
            d="M24 4L8 10V22C8 30 12 37 24 44C36 37 40 30 40 22V10L24 4Z"
            fill="url(#shieldGradient)"
            opacity="0.2"
          />

          {/* Two connected peers */}
          <circle cx="18" cy="24" r="6" fill="url(#peerGradient1)" />
          <circle cx="30" cy="24" r="6" fill="url(#peerGradient2)" />

          {/* Connection line between peers */}
          <path
            d="M24 18L24 30"
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Checkmark for verified/secure */}
          <path
            d="M20 24L22 26L28 20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="peerGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="peerGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Link
        href="/"
        className="text-gradient-purple hover:text-purple-400 hover:bg-[rgba(147,51,234,0.1)] hover:drop-shadow-[0_0_10px_rgba(147,51,234,0.8)] transition-all font-bold text-xl ml-3 px-2 py-1 rounded"
      >
        Peersy
      </Link>
    </div>
  );
}