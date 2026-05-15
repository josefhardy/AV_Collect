/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  basePath: '/AV_Collect',
  assetPrefix: '/AV_Collect/',
}

export default nextConfig
