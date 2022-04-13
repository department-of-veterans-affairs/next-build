/** @type {import('next').NextConfig} */


const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
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
}

module.exports = nextConfig

