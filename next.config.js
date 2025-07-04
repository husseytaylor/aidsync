const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
module.exports = withBundleAnalyzer({
  productionBrowserSourceMaps: true,
  modularizeImports: {
    'lucide-react': { transform: 'lucide-react/dist/esm/icons/{{member}}' }
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; frame-src https://*.calendly.com; img-src 'self' data:;" },
          { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains; preload' }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.YOURDOMAIN.com' }
        ],
        destination: 'https://YOURDOMAIN.com/:path*',
        permanent: true
      }
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
});
