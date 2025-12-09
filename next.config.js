// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ignore TypeScript errors during builds for now
  typescript: {
    ignoreBuildErrors: true,
  },
  
  async headers() {
    return [
      {
        source: '/api/proxy/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, X-Access-Token',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' blob: data:; object-src 'self' blob: data:;"
          }
        ],
      },
    ]
  },
  
  // Turbopack config (Next.js 16+)
  turbopack: {
    resolveAlias: {
      'pdfjs-dist/build/pdf.worker.min.js': 'pdfjs-dist/build/pdf.worker.min.js',
    },
  },
  
  // Enhanced webpack config for PDF.js (for non-Turbopack builds)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle client-side only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
      }
    }
    
    // PDF.js specific configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.min.js': 'pdfjs-dist/build/pdf.worker.min.js',
    }
    
    return config
  },
}

module.exports = nextConfig