const isProd = process.env.APP_ENV === 'prod'
const isExport = process.env.BUILD_OPTION === 'static'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compress: false,

  serverExternalPackages: ['dd-trace'],

  images: {
    loaderFile: './src/components/mediaImage/customLoader.js',
    loader: 'custom',
    unoptimized: true,
  },

  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  assetPrefix: undefined,
  output: isExport ? 'export' : undefined,

  // assetPrefix: isProd
  //   ? 'https://s3.us-gov-west-1.amazonaws.com/next-content.www.va.gov/'
  //   : undefined,
  //arbitrary; 60 is default but it's too small
  staticPageGenerationTimeout: 300,

  experimental: {
    // 512kb, is 128kb by default
    largePageDataBytes: 512 * 1000,

    // Enable React 19 optimizations
    reactCompiler: true,

    // Throttle static generation proccesses.
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 3,
    staticGenerationMinPagesPerWorker: 3,
  },

  // This ensures the generated files use a consistent hash inside of the generated `.next/` directory.
  // Necessary in order for correct asset references in various locations (S3 static files, cms preview server, etc)
  generateBuildId: async () => {
    // this could be anything, use latest git hash if it exists
    return process.env.GIT_HASH ?? 'vagovprod'
  },

  // Add custom webpack config to include the `dd-trace` package on the server side
  webpack(webpackConfig, { isServer }) {
    if (isServer) {
      webpackConfig.externals = webpackConfig.externals || []
      webpackConfig.externals.push('dd-trace')
    }

    return {
      ...webpackConfig,
      optimization: {
        ...webpackConfig.optimization,
        minimize: isProd,
      },
    }
  },

  turbopack: {
    resolveAlias: {
      'dd-trace': 'dd-trace',
    },
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
