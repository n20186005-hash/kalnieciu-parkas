import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  // OpenNext (Cloudflare Workers) 需要 standalone 产物，不能用 'export'
  output: 'standalone' as const,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
