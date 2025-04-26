/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // When you call /api/anything
        destination: "http://localhost:8001/api/:path*", // Proxy to real server
      },
    ];
  },
};

module.exports = nextConfig;
