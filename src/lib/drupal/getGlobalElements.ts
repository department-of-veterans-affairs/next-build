import { formatter } from '@/data/queries/banners'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { LayoutProps } from '@/templates/globals/wrapper'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { queries } from '@/data/queries'

const nonSlugRoute = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=/`

// Helper function to fetch global elements for layout.
// It is called once for every page on build.
// TODO: add cache layer to drupalClient query results

export async function getGlobalElements(
  jsonApiEntryPoint?: string,
  itemPath?: string,
  headerOnly: boolean = false
): Promise<LayoutProps> {
  let banners = []

  // If we are not in headerOnly mode and the necessary parameters are provided, fetch banners
  // move all of this into @/data/queries/banners.ts
  if (!headerOnly && jsonApiEntryPoint && itemPath) {
    let bannerPath = `${jsonApiEntryPoint}/banner-alerts?item-path=${itemPath}`

    if (itemPath.includes('home')) {
      bannerPath = nonSlugRoute
    }

    const requestBanner = await drupalClient.fetch(`${bannerPath}`)
    const bannerData: [] | unknown = drupalClient.deserialize(
      await requestBanner.json()
    )
    banners = formatter(bannerData as NodeBanner[])

    // gather data for banners currently visible on this page
    // const bannerData = await queries.getData('banner--alerts_lookup')
  }

  const headerFooterData = await queries.getData('header-footer-data')

  return {
    bannerData: banners,
    headerFooterData,
  }
}
