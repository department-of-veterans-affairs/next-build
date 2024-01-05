const { getFetcher } = require('proxy-fetcher')

// Given an .xml file, extracts every string inside a <loc> element.
function extractUrlsFromXML(xml) {
  return [...xml.matchAll(new RegExp(`<loc>(.|\n)*?</loc>`, 'g'))].map(
    ([loc]) => {
      return loc
        .replace('<loc>', '')
        .replace('</loc>', '')
        .replace(/^https:/, 'http:')
    }
  )
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

// VA.gov sitemaps have a lot of urls in them. Helper function for things that
// may want to parallelize checking that list (broken links, a11y, etc.)
function splitPagesIntoSegments(pages, count) {
  const segmentSize = Math.ceil(pages.length / count)
  return new Array(count).fill().map((_, index) => {
    return pages.slice(index * segmentSize, (index + 1) * segmentSize)
  })
}

module.exports = { getSitemapLocations, splitPagesIntoSegments }
