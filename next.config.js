const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Removed `output: 'export'`
  images: {
    // You can keep or remove this depending on your needs.
    // Keeping for now since you already added it:
    unoptimized: true,
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "res.cloudinary.com" },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: { optimizePackageImports: ['react-toastify', 'recharts'] },
  modularizeImports: {
    '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' }
  },
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
};

module.exports = withBundleAnalyzer(nextConfig);
