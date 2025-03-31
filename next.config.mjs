/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['undici'],
  webpack: (config, { isServer }) => {
    // Fix for private class fields in undici
    config.module.rules.push({
      test: /node_modules\/undici\/.*\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-private-methods']
        }
      }
    });
    
    return config;
  }
};

export default nextConfig;
