import { RESOURCE_TYPES } from '@/pages/[[...slug]]'
import { drupalClient } from '@/lib/utils/drupalClient'

function generateSiteMap(slugs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     ${slugs
       .map((slug) => {
         return `
           <url>
               <loc>${`http://localhost:3000/${slug}`}</loc>
           </url>
         `
       })
       .join('')}
   </urlset>
 `
}

// This doesn't work with `yarn export` but does with `yarn build`
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

// Empty because we don't want to render an actual component, we want the xml from above
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SiteMap() {}
