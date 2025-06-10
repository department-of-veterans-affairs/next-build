/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  // see https://www.npmjs.com/package/next-sitemap for all options
  siteUrl: process.env.SITE_URL || 'https://localhost:8001',
  // output: 'export' directory from next config
  outDir: 'out',
  generateIndexSitemap: false,
  sitemapSize: 100000, //set some large size in bytes so we have one sitemap.xml?
  // relative paths to exclude
  exclude: [],
  // change the default sitemap file name
  sitemapBaseFileName: 'sitemap-nb',

  generateRobotsTxt: false, // (optional)

  // todo: migrate to server side sitemap to include last edited date from content for lastmod
  // will need to update static-path-resources to optionally include that field when requested
  // https://www.npmjs.com/package/next-sitemap#server-side-sitemap-getserversidesitemap
}

export default sitemapConfig
