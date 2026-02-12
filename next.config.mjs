/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    // Add externals for Node.js specific modules
    if (!isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }
    
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
    };

    // Ignore optional dependencies from wagmi connectors
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@base-org\/account$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@coinbase\/wallet-sdk$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@gemini-wallet\/core$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@metamask\/sdk$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@safe-global\/safe-apps-sdk$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@safe-global\/safe-apps-provider$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^@walletconnect\/ethereum-provider$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^porto$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^porto\/internal$/,
      }),
    );

    return config;
  },
};

export default nextConfig;
