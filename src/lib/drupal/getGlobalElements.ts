import { LayoutProps } from '@/templates/globals/wrapper'
import { queries } from '@/data/queries'

// Helper function to fetch global elements for layout. This is called once for every page during a build,
// because banners are associated with individual pages via slug lookup (itemPath).
export async function getGlobalElements(
  jsonApiEntryPoint?: string,
  itemPath?: string,
  headerOnly: boolean = false
): Promise<LayoutProps> {
  // This query is cached so header and footer menu data is only directly requested once per build.
  const headerFooterData = await queries.getData('header-footer-data')

  // Banners can be fetched as long as we have context and a path (slug).
  if (!headerOnly && jsonApiEntryPoint && itemPath) {
    // Gather data for banners currently visible on this page.
    const bannerData = await queries.getData('banner-data', {
      jsonApiEntryPoint,
      itemPath,
    })

    return {
      bannerData,
      headerFooterData,
    }
  }

  // Otherwise return header data without banners.
  return {
    bannerData: [],
    headerFooterData,
  }
}
