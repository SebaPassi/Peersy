import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Link
        href="/"
        className="text-gradient-purple hover:text-purple-400 hover:bg-[rgba(147,51,234,0.1)] hover:drop-shadow-[0_0_10px_rgba(147,51,234,0.8)] transition-all font-bold text-xl ml-3 px-2 py-1 rounded"
      >
        Peersy
      </Link>
    </div>
  );
}