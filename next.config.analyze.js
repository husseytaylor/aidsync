const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  reportFilename: './analyze/client.html',
});

module.exports = withBundleAnalyzer({
  // ...existing next.js config
});
