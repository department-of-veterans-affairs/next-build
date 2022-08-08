import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'

import { drupalClient } from '@/utils/drupalClient'
import { LayoutProps } from 'components/layout'
import { transformBannerDataService } from '@/components/banner/dataService'
type GlobalElements = LayoutProps

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.

export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  // global context
  const slug = await drupalClient.getPathFromContext(context)
  const path = await drupalClient.translatePathFromContext(context)
  const route = `${path?.jsonapi?.entryPoint}`

  let bannerPath = `${route}/banner-alerts?item-path=${slug}`
  if (slug.includes('home')) {
    bannerPath = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=/`
  }

  const requestBanner = await drupalClient.fetch(`${bannerPath}`)
  const bannerData = drupalClient.deserialize(await requestBanner.json())
  const banner = await transformBannerDataService({ bannerData })

  return {
    props: {
      bannerData: banner,
    },
  }
}
