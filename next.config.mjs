/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: false,
  serverExternalPackages: ['@duckdb/node-api', '@duckdb/node-bindings'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': ['./node_modules/xac-loglevel/**'],
    '/*': [
      './node_modules/.pnpm/@duckdb+*/**/*',
    ],
  },
};

export default nextConfig;
