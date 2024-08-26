import { LayoutProps } from '@/templates/layouts/wrapper'
import { queries } from '@/data/queries'

// Helper function to fetch global elements for layout. This is called once for every page during a build,
// because banners are associated with individual pages via slug lookup (itemPath).
export async function getGlobalElements(
  itemPath?: string,
  headerOnly: boolean = false
): Promise<LayoutProps> {
  // This query is cached so header and footer menu data is only directly requested once per build.
  const headerFooterData = await queries.getData('header-footer-data')

  console.log('header footer data was fetched')

  // Banners can be fetched as long as we have context and a path (slug).
  if (!headerOnly && itemPath) {
    // Gather data for banners currently visible on this page.
    const bannerData = await queries.getData('banner-data', {
      itemPath,
    })

    console.log('return header footer, header only is false', itemPath)

    return {
      bannerData,
      headerFooterData,
    }
  }

  console.log('return empty banner data, header is true')

  // Otherwise return header data without banners.
  return {
    bannerData: [],
    headerFooterData,
  }
}
