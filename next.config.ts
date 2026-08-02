import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Alle productfoto's staan lokaal in /public/images. Zie README.md om ze
    // te vervangen door de foto's uit Instagram.
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // De oude adressen bestonden toen we nog met confectiematen werkten. Ze
    // kunnen nog in oude mails of zoekresultaten staan, dus we sturen ze door.
    return [
      { source: '/service/maattabel', destination: '/service/op-maat', permanent: true },
      {
        source: '/service/retourneren',
        destination: '/service/passen-en-aanpassen',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
