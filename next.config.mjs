// Enable bundle analyzer for performance insights
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = require('./src/next.config');

module.exports = withBundleAnalyzer(nextConfig);
