/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }
    
    return config
  },
  
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development'
  },
  
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig
