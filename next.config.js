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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          // redis can't be used client side
          // see https://github.com/getsentry/sentry-javascript/issues/6548
          // note: this repo isn't using sentry but the issue explains the problem
          net: false,
          dns: false,
          tls: false,
          assert: false,
          fs: false,
        },
      }
    }
    return config
  },
}
module.exports = nextConfig
