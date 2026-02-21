import type { NextConfig } from 'next';

// “Allow loading and optimizing images from this external domain.”
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rvdximdbglloxoxfsfla.supabase.co',
      },
    ],
  },
};

export default nextConfig;
