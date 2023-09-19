/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: [
      `${process.env.NEXT_IMAGE_DOMAIN}`,
      'va-gov-cms.ddev.site',
      's3-us-gov-west-1.amazonaws.com',
      'va.gov',
    ],
    loader: 'custom',
  },
  env: {
    NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
    GOOGLE_TAG_MANAGER_AUTH: process.env.GOOGLE_TAG_MANAGER_AUTH,
    GOOGLE_TAG_MANAGER_PREVIEW: process.env.GOOGLE_TAG_MANAGER_PREVIEW,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  // experimental: {
  //   // This is experimental but can
  //   // be enabled to allow parallel threads
  //   // with nextjs automatic static generation
  //   workerThreads: false,
  //   cpus: 1,
  // },
}
module.exports = nextConfig
