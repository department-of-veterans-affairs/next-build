import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { Menu } from '@/types/dataTypes/drupal/menu'
import { buildHeaderFooterData } from '@/lib/utils/headerFooter'

export type RawHeaderFooterData = {
  footerColumns: Menu
  footerBottomRail: Menu
  megaMenuData: Menu
}

export type HeaderFooterData = {
  footerData?: any
  megaMenuData?: any
}

// Define the query params for fetching header and footer menu data.
export const params: QueryParams<null> = () => {
  return queries.getParams().addFields('menu_items', ['title,url'])
}

export const data: QueryData<any, RawHeaderFooterData> = async (opts) => {
  // Gather data from the different menus for the headerFooter data object
  const footerColumns = await drupalClient.getMenu('va-gov-footer', opts.params)
  const footerBottomRail = await drupalClient.getMenu(
    'footer-bottom-rail',
    opts.params
  )
  const megaMenuData = await drupalClient.getMenu(
    'header-megamenu',
    opts.params
  )

  return {
    footerColumns,
    footerBottomRail,
    megaMenuData,
  }
}

export const formatter: QueryFormatter<
  RawHeaderFooterData,
  HeaderFooterData
> = ({ footerColumns, footerBottomRail, megaMenuData }) => {
  // naming things is so hard
  const { footerData, megaMenuData: megaMenu } = buildHeaderFooterData({
    footerBottomRail,
    footerColumns,
    megaMenuData,
  })
  return {
    footerData,
    megaMenuData: megaMenu,
  }
}
