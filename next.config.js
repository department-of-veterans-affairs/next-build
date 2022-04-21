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
  },
  env: {
    NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  },
  reactStrictMode: true,
  swcMinify: true,
}
module.exports = nextConfig
