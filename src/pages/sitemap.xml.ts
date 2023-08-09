import { RESOURCE_TYPES } from '@/pages/[[...slug]]'
import { GetStaticPathsResult } from 'next'
import { drupalClient } from '@/lib/utils/drupalClient'

function generateSiteMap(slugs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add the static URLs manually -->
     ${slugs
       .map((path) => {
         return `
           <url>
               <loc>${`http://localhost:8001/${path}`}</loc>
           </url>
         `
       })
       .join('')}
   </urlset>
 `
}

export async function getServerSideProps(context) {
  const paths = await drupalClient.getStaticPathsFromContext(
    Array.from(RESOURCE_TYPES),
    context
  )
  const { res } = context

  const slugs = paths.map((path) => {
    if (typeof path === 'string') return path

    return path.params.slug.join('/')
  })

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(slugs)

  res.setHeader('Content-Type', 'text/xml')
  // Send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SiteMap() {}
