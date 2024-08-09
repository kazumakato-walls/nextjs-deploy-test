import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/dates'],
    },
    output: 'standalone',
    env: {
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL, // 環境変数を設定
    }
};

export default withBundleAnalyzer(nextConfig);
