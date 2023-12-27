import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { Menu, HeaderMegaMenu } from '@/types/dataTypes/drupal/menu'
import { HeaderFooterData } from '@/types/dataTypes/formatted/headerFooter'
import { buildHeaderFooterData } from '@/lib/utils/headerFooter'
import { getMenu } from '@/lib/drupal/drupalClient'

export type RawHeaderFooterData = {
  footerColumns: Menu
  footerBottomRail: Menu
  headerMegaMenu: HeaderMegaMenu
}

// Define the query params for fetching footer menu data.
export const params: QueryParams<null> = () => {
  return queries.getParams().addFields('menu_items', ['title,url'])
}

// Define the query params for fetching header megamenu data. Include referenced promo block data, if present
export const megaMenuParams: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_promo_reference',
      'field_promo_reference.field_image',
      'field_promo_reference.field_image.image',
      'field_promo_reference.field_promo_link',
    ])
}

export const data: QueryData<null, RawHeaderFooterData> = async () => {
  // Gather data from the different menus for the headerFooter data object
  const footerColumns = await getMenu('va-gov-footer', params)
  const footerBottomRail = await getMenu('footer-bottom-rail', params)
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
