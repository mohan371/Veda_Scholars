import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/book-counselling',
        destination: '/contact?type=counselling',
        permanent: true,
      },
      {
        source: '/partner',
        destination: '/partner-with-us',
        permanent: true,
      },
      {
        source: '/get-started',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
