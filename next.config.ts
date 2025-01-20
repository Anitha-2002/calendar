import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };

      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
    }

    return config;
  },
};

export default nextConfig;
