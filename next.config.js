/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // Replit-friendly: longer timeouts for scraper
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
