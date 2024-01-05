const { getFetcher } = require('proxy-fetcher')

function extractUrlsFromXML(xml) {
  const urls = [...xml.matchAll(new RegExp(`<loc>(.|\n)*?</loc>`, 'g'))].map(
    ([loc]) => {
      return loc
        .replace('<loc>', '')
        .replace('</loc>', '')
        .replace(/^https:/, 'http:')
    }
  )

  return urls
}

// Gets all URLs included in the output from `yarn build:sitemap` from all sitemaps
async function getSitemapLocations(baseUrl) {
  const fetcher = getFetcher(baseUrl)
  // handle trailing slash
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const mainSitemapUrl = `${base}/sitemap.xml`

  const response = await fetcher(mainSitemapUrl)

  const xml = await response.text()
  const locs = []

  const urls = extractUrlsFromXML(xml)

  for (const url of urls) {
    // toplevel sitemap is an index of additional sitemaps
    if (url.endsWith('.xml')) {
      const response = await fetcher(url)
      const xml = await response.text()
      const urls = extractUrlsFromXML(xml)
      locs.push(urls)
    } else {
      locs.push(url)
    }
  }

  return locs.flat()
}

module.exports = getSitemapLocations
