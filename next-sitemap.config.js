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
  changefreq: false,
  priority: false,
  generateRobotsTxt: false, // (optional)
  transform: async (config, path) => {
    // Transform found paths to add lastmod date https://github.com/iamvishnusankar/next-sitemap?tab=readme-ov-file#custom-transformation-function
    const { JSDOM } = await import('jsdom') // Import JSDOM to parse HTML files
    const pathToFile = `./out${path}/index.html` // Construct the path to the static file in the `out` directory
    const date = JSDOM.fromFile(pathToFile).then((dom) => {
      return dom.window.document
        .querySelector("meta[name='DC.Date']")
        .getAttribute('content')
    }) // get the date from the DC.Date meta tag in the HTML of the static file for each path
    return {
      loc: path, // Required to be returned in sitemap => this will be exported as http(s)://<config.siteUrl>/<path>
      lastmod: await date, // The parsed date from the HTML file
    }
  },
  // todo: migrate to server side sitemap to include last edited date from content for lastmod
  // will need to update static-path-resources to optionally include that field when requested
  // https://www.npmjs.com/package/next-sitemap#server-side-sitemap-getserversidesitemap
}

export default sitemapConfig
