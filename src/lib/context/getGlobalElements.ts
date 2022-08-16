import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { formatter } from '@/data/queries/banners'
import { drupalClient } from '@/lib/utils/drupalClient'

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
const nonSlugRoute = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=/`

export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
) {
  // global context
  const slug = await drupalClient.getPathFromContext(context)
  const path = await drupalClient.translatePathFromContext(context)
  const route = `${path?.jsonapi?.entryPoint}`

  let bannerPath = `${route}/banner-alerts?item-path=${slug}`

  if (slug.includes('home')) {
    bannerPath = `${nonSlugRoute}`
  }

  const requestBanner = await drupalClient.fetch(`${bannerPath}`)
  const bannerData = drupalClient.deserialize(await requestBanner.json())
  const banner = formatter({ bannerData } as any)

  return {
    props: {
      bannerData: banner || null,
    },
  }
}
