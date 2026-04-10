import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow fetching from Google Sheets
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
