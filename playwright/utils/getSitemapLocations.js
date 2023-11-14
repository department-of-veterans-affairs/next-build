import fetch from 'cross-fetch'

async function getSitemapLocations(baseUrl) {
  const response = await fetch(`${baseUrl}/sitemap.xml`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/xml',
    },
  })
  const xml = await response.text()
  const locs = [...xml.matchAll(new RegExp(`<loc>(.|\n)*?</loc>`, 'g'))].map(
    ([loc]) => {
      return loc
        .replace('<loc>', '')
        .replace('</loc>', '')
        .replace(/^https:/, 'http:')
    }
  )
  return locs
}

module.exports = getSitemapLocations
