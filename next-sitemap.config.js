/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // see https://www.npmjs.com/package/next-sitemap for all options
  siteUrl: process.env.SITE_URL || 'https://localhost:8001',
  // output: 'export' directory from next config
  outDir: 'out',
  generateIndexSitemap: true,
  // relative paths to exclude
  exclude: [],

  generateRobotsTxt: true, // (optional)
}
