import { getFetcher } from 'proxy-fetcher'
import crossFetch from 'cross-fetch'

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
  const fetcher =
    process.env.USE_PROXY === true ? getFetcher(baseUrl) : crossFetch
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
function splitPagesIntoBatches(pages, batchCount) {
  const batchSize = Math.ceil(pages.length / batchCount)
  return new Array(Number(batchCount)).fill().map((_, index) => {
    return pages.slice(index * batchSize, (index + 1) * batchSize)
  })
}

// Based on a number of instances (i.e. 16) and a specific instance (i.e. 7),
// divide pages into equal slices based on number of instances and return the
// correct slice for the specific instance.
// Number sequences are 1-based.
function getPagesSlice(pages, totalSlices, requestedSlice) {
  const sliceSize = Math.ceil(pages.length / totalSlices)
  return pages.slice(
    (requestedSlice - 1) * sliceSize,
    requestedSlice * sliceSize
  )
}

module.exports = { getSitemapLocations, splitPagesIntoBatches, getPagesSlice }
