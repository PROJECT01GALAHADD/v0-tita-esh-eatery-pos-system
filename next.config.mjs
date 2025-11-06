/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  // Fail builds in Production to avoid silently shipping type errors
  typescript: {
    ignoreBuildErrors: !isProd,
  },
  // Lint during Production builds; skip in dev to speed up iteration
  eslint: {
    ignoreDuringBuilds: !isProd,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
