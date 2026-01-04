const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },

  compiler: {
    styledComponents: true,
    // Garder les attributs data-* en dev/test (E2E) pour les sélecteurs Playwright
    reactRemoveProperties: process.env.NODE_ENV === 'production'
      ? { properties: ['^data-test'] }
      : false,
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
    emotion: true,
  },

  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.BACKEND_ORIGIN || 'http://localhost:4000'}/api/:path*`,
    },
  ],

  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
