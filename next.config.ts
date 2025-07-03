
import type {NextConfig} from 'next';

const cspHeader = [
    "default-src 'self';",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.calendly.com;",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com;",
    "img-src 'self' data: https://placehold.co;",
    "font-src 'self' https://fonts.gstatic.com;",
    // Allowing Supabase connections and n8n webhooks
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://*.n8n.cloud;",
    // Allowing Calendly embed and Firebase Studio preview
    "frame-src https://calendly.com https://*.cloudworkstations.dev;",
    "form-action 'self';",
    "base-uri 'self';",
    "object-src 'none';",
    "frame-ancestors 'self' https://*.cloudworkstations.dev;",
].join(' ');


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
           {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
