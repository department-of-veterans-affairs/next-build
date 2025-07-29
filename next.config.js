const isProd = process.env.APP_ENV === 'prod'
const isExport = process.env.BUILD_OPTION === 'static'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compress: false,
  images: {
    loaderFile: './src/templates/common/mediaImage/customLoader.js',
    loader: 'custom',
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  assetPrefix: undefined,
  output: isExport ? 'export' : undefined,
  experimental: {
    largePageDataBytes: 512 * 1000, // 512kb, is 128kb by default
  },
  // assetPrefix: isProd
  //   ? 'https://s3.us-gov-west-1.amazonaws.com/next-content.www.va.gov/'
  //   : undefined,
  staticPageGenerationTimeout: 180, //arbitrary; 60 is default but it's too small
  // This ensures the generated files use a consistent hash inside of the generated `.next/` directory.
  // Necessary in order for correct asset references in various locations (S3 static files, cms preview server, etc)
  generateBuildId: async () => {
    // this could be anything, use latest git hash if it exists
    return process.env.GIT_HASH ?? 'vagovprod'
  },
  webpack(webpackConfig) {
    return {
      ...webpackConfig,
      optimization: {
        ...webpackConfig.optimization,
        minimize: isProd,
      },
    }
  },
}

export default nextConfig
