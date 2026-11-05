/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === 'true' || process.env.CLOUDFLARE_PAGES === 'true' || process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@beyond/types'],
  ...(isExport ? {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
    },
  } : {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
    },
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:4000/api/v1/:path*',
        },
      ];
    },
  }),
};

export default nextConfig;
