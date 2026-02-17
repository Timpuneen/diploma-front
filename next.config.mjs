/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      ? undefined
      : "http://127.0.0.1:3838";

    // If NEXT_PUBLIC_API_BASE_URL is set, the client fetches directly.
    // Otherwise proxy /api/v1/* to the local backend to avoid CORS.
    if (!backendUrl) return [];

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
}

export default nextConfig
