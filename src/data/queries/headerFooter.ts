import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { Menu, HeaderMegaMenu } from '@/types/drupal/menu'
import { HeaderFooterData } from '@/types/formatted/headerFooter'
import { buildHeaderFooterData } from '@/lib/utils/headerFooter'
import { getMenu } from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'

export type RawHeaderFooterData = {
  footerColumns: Menu
  footerBottomRail: Menu
  headerMegaMenu: HeaderMegaMenu
}

// Define extra equery params for fetching header megamenu data. Include referenced promo block data, if present
export const megaMenuParams: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_promo_reference', 'block_content--promo'),
  ])
}

export const data: QueryData<null, RawHeaderFooterData> = async () => {
  // Gather data from the different menus for the headerFooter data object
  const footerColumns = await getMenu('va-gov-footer')
  const footerBottomRail = await getMenu('footer-bottom-rail')
  const headerMegaMenu: HeaderMegaMenu = await getMenu(
    'header-megamenu',
    megaMenuParams
  )

  return {
    footerColumns,
    footerBottomRail,
    headerMegaMenu,
  }
}

export const formatter: QueryFormatter<
  RawHeaderFooterData,
  HeaderFooterData
> = ({ footerColumns, footerBottomRail, headerMegaMenu }) => {
  /* eslint-disable no-console */
  console.log(footerBottomRail)
  const { footerData, megaMenuData } = buildHeaderFooterData({
    footerBottomRail,
    footerColumns,
    headerMegaMenu,
  })

  // Data assembled into shape front-end widget expects
  return {
    footerData,
    megaMenuData,
  }
}
