import { QueryData, QueryFormatter } from 'next-drupal-query'
import { Menu } from '@/types/drupal/menu'
import { FooterLink } from './formatted-type'
import { buildFooterData } from './utils'
import { getMenu } from '@/lib/drupal/query'

export type RawFooterData = {
  footerColumns: Menu
  footerBottomRail: Menu
}

export const data: QueryData<null, RawFooterData> = async () => {
  // Gather data from the different footer menus
  const footerColumns = await getMenu('va-gov-footer')
  const footerBottomRail = await getMenu('footer-bottom-rail')

  return {
    footerColumns,
    footerBottomRail,
  }
}

export const formatter: QueryFormatter<RawFooterData, FooterLink[]> = ({
  footerColumns,
  footerBottomRail,
}) => {
  // Return the formatted footer data
  return buildFooterData({ footerColumns, footerBottomRail })
}
