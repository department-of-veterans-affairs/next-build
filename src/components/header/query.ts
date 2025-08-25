import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { HeaderMegaMenu } from '@/types/drupal/menu'
import { MegaMenuSection } from './formatted-type'
import { formatHeaderData } from '@/lib/utils/header'
import { getMenu } from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'

export type RawHeaderData = {
  headerMegaMenu: HeaderMegaMenu
}

// Define extra query params for fetching header megamenu data. Include referenced promo block data, if present
export const megaMenuParams: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_promo_reference', 'block_content--promo'),
  ])
}

export const data: QueryData<null, RawHeaderData> = async () => {
  // Gather data from the header megamenu
  const headerMegaMenu: HeaderMegaMenu = await getMenu(
    'header-megamenu',
    megaMenuParams
  )

  return {
    headerMegaMenu,
  }
}

export const formatter: QueryFormatter<RawHeaderData, MegaMenuSection[]> = ({
  headerMegaMenu,
}) => {
  // Use the SITE_URL with a fallback in the event it is missing.
  const hostUrl = 'https://www.va.gov/'

  // Assemble header megamenu data from Drupal
  return formatHeaderData(headerMegaMenu, hostUrl)
}
