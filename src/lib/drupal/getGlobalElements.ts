import { formatter } from '@/data/queries/banners'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { LayoutProps } from '@/templates/globals/wrapper'
import { NodeBanner } from '@/types/dataTypes/drupal/node'

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
const nonSlugRoute = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=/`

type GlobalElements = LayoutProps

export async function getGlobalElements(
  jsonApiEntryPoint: string,
  itemPath: string
): Promise<GlobalElements> {
  let bannerPath = `${jsonApiEntryPoint}/banner-alerts?item-path=${itemPath}`

  if (itemPath.includes('home')) {
    bannerPath = `${nonSlugRoute}`
  }

  const requestBanner = await drupalClient.fetch(`${bannerPath}`)
  const bannerData: [] | unknown = drupalClient.deserialize(
    await requestBanner.json()
  )
  const banners = formatter(bannerData as NodeBanner[])
  return {
    bannerData: banners,
  }
}
