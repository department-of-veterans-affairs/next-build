import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { formatter } from '@/data/queries/banners'
import { drupalClient } from '@/lib/utils/drupalClient'
import { LayoutProps } from '@/templates/globals/wrapper'
import { NodeBanner } from '@/types/dataTypes/drupal/node'

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
const nonSlugRoute = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=/`

type GlobalElements = LayoutProps

export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  // global context
  const slug = await drupalClient.getPathFromContext(context)
  const path = await drupalClient.translatePathFromContext(context)
  const route = `${path?.jsonapi?.entryPoint}`

  let bannerPath = `${route}/banner-alerts?item-path=${slug}`

  if (slug.includes('home')) {
    bannerPath = `${nonSlugRoute}`
  }

  const requestBanner = await drupalClient.fetch(`${bannerPath}`)
  const bannerData: object | unknown = drupalClient.deserialize(
    await requestBanner.json()
  )
  const banners = formatter(bannerData as NodeBanner[])
  return {
    bannerData: banners as NodeBanner[],
  }
}
