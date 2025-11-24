import { convertLinkToAbsolute } from '@/lib/utils/header'
import { FOOTER_LINKS } from '@/lib/constants/footer-links'
import { FooterLink } from './formatted-type'
import { RawFooterData } from './query'
import { Menu, MenuItem } from '@/types/drupal/menu'

// Helper functions to format footer menu items
const formatLink = (link, linkIndex, columnId, hostUrl): FooterLink => {
  return {
    column: columnId,
    href: convertLinkToAbsolute(hostUrl, link.url),
    order: linkIndex + 1,
    target: link?.options?.attributes?.target || null,
    title: link.title,
  }
}

const formatColumn = (
  data: Menu | MenuItem,
  columnId: string | number,
  hostUrl: string
): FooterLink[] =>
  data.items.map((link, linkIndex) =>
    formatLink(link, linkIndex, columnId, hostUrl)
  )

// This function assembles footer data from drupal menus into the shape vets-website component expects
export const buildFooterData = ({
  footerBottomRail,
  footerColumns,
}: RawFooterData): FooterLink[] => {
  // Use the SITE_URL with a fallback in the event it is missing.
  const hostUrl = 'https://www.va.gov/'

  // Assemble footer menu data from Drupal
  const footerBottomRailData = formatColumn(
    footerBottomRail,
    'bottom_rail',
    hostUrl
  )
  const footerColumnsData = footerColumns.tree
    .map((column, index) => formatColumn(column, index + 1, hostUrl))
    .flat()

  const footerData = [
    ...footerBottomRailData,
    ...footerColumnsData,
    ...FOOTER_LINKS,
  ]

  return footerData
}
