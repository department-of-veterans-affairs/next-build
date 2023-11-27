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
    ([loc]) => loc.replace('<loc>', '').replace('</loc>', '')
  )
  return locs
}

module.exports = getSitemapLocations
