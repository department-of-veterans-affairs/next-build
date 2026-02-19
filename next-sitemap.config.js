// Matches <meta name="DC.Date" content="...">
const RE_META_DATE =
  /<meta\s+name\s*=\s*["']DC\.Date["'][^>]*content\s*=\s*["']([^"']+)["']/i

const isHomepageFeatureEnabled =
  process.env.FEATURE_NEXT_BUILD_CONTENT_ALL === 'true' ||
  process.env.FEATURE_NEXT_BUILD_CONTENT_HOMEPAGE === 'true'

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
  transform: async (_config, path) => {
    if (path === '/' && !isHomepageFeatureEnabled) {
      // Don't include the homepage in the sitemap if the homepage feature flag is disabled
      return null
    }

    // Transform found paths to add lastmod date https://github.com/iamvishnusankar/next-sitemap?tab=readme-ov-file#custom-transformation-function
    const fs = await import('fs/promises')
    const pathToFile = `./out${path}/index.html`
    // A possible future optimization could be to read the file as a stream to avoid
    // loading the entire file into memory, especially since this meta tag is usually
    // near the beginning of the file.
    const html = await fs.readFile(pathToFile, 'utf-8')
    const dateMatch = html.match(RE_META_DATE)
    const date = dateMatch ? dateMatch[1] : null
    return {
      loc: path, // Required to be returned in sitemap => this will be exported as http(s)://<config.siteUrl>/<path>
      lastmod: date, // The parsed date from the HTML file
    }
  },
  // todo: migrate to server side sitemap to include last edited date from content for lastmod
  // will need to update static-path-resources to optionally include that field when requested
  // https://www.npmjs.com/package/next-sitemap#server-side-sitemap-getserversidesitemap
}

export default sitemapConfig
