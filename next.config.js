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
}
module.exports = nextConfig
