/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  // output: 'export' directory from next config
  outDir: 'out',
  generateIndexSitemap: false, // set to true as we add more content types
  // relative paths to exclude
  exclude: [],

  generateRobotsTxt: true, // (optional)
}
