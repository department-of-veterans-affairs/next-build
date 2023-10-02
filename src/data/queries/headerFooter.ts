import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { Menu } from '@/types/dataTypes/drupal/menu'
import { buildHeaderFooterData } from '@/lib/utils/headerFooter'

export type RawHeaderFooterData = {
  footerColumns: Menu
  footerBottomRail: Menu
  headerMegaMenu: Menu
}

export type HeaderFooterData = {
  footerData?: any
  megaMenuData?: any
}

// Define the query params for fetching footer menu data.
export const params: QueryParams<null> = () => {
  return queries.getParams().addFields('menu_items', ['title,url'])
}

// Define the query params for fetching header megamenu data.
export const megaMenuParams: QueryParams<null> = () => {
  return queries
    .getParams()
    .addFields('menu_items', ['title,url,field_promo_reference'])
    .addInclude(['field_promo_reference'])
}

export const data: QueryData<any, RawHeaderFooterData> = async (opts) => {
  // Gather data from the different menus for the headerFooter data object
  const footerColumns = await drupalClient.getMenu('va-gov-footer', opts.params)
  const footerBottomRail = await drupalClient.getMenu(
    'footer-bottom-rail',
    opts.params
  )
  const headerMegaMenu = await drupalClient.getMenu(
    'header-megamenu',
    opts.megaMenuParams
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
