const isProd = process.env.APP_ENV === 'prod'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loaderFile: './src/templates/common/mediaImage/customLoader.js',
    loader: 'custom',
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  assetPrefix: isProd
    ? 'https://s3.us-gov-west-1.amazonaws.com/next-content.www.va.gov/'
    : undefined,
  staticPageGenerationTimeout: 180, //arbitrary; 60 is default but it's too small
  experimental: {
    largePageDataBytes: 512 * 1000, // 512kb, is 128kb by default
  },
}

export default nextConfig
