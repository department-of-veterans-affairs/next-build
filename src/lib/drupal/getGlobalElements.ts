import { formatter } from '@/data/queries/banners'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { LayoutProps } from '@/templates/globals/wrapper'
import { NodeBanner } from '@/types/dataTypes/drupal/node'
import { queries } from '@/data/queries'

// Helper function to fetch global elements for layout.
// It is called once for every page on build.
// TODO: add cache layer to drupalClient query results
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

  // gather data for header and footer object
  const headerFooterData = await queries.getData('header-footer-data')

  return {
    bannerData: banners,
    headerFooterData
  }
}
