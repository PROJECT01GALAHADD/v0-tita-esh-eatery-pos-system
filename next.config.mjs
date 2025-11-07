/** @type {import('next').NextConfig} */
const nextConfig = {
  // Host the app under "/app" so production URLs like
  // https://titaesh-pos.vercel.app/app/pos resolve correctly
  basePath: '/app',
  typescript: {
    // Always fail builds on type errors to prevent silent failures
    ignoreBuildErrors: false,
  },
  eslint: {
    // Run linting during all builds to catch issues early
    ignoreDuringBuilds: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
