require('./scripts/env-handler')

// eslint-disable-next-line no-console
console.log(
  `Using environment variables from: envs/.env.${
    process.env.APP_ENV || 'local'
  }`
)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loaderFile: './src/templates/common/image/customLoader.js',
    loader: 'custom',
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 180, //arbitrary; 60 is default but it's too small
  experimental: {
    // so tugboat doesn't go crazy
    cpus: process.env.CI ? 3 : null,
  },
}
module.exports = nextConfig
