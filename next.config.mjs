/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    strict: true,
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
