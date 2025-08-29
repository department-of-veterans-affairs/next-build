import { convertLinkToAbsolute } from '@/lib/utils/header'
import { FOOTER_LINKS } from '@/lib/constants/footer-links'
import { FooterLink } from './formatted-type'
import { RawFooterData } from './query'

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

const formatColumn = (data, columnId, hostUrl): FooterLink[] => {
  return data?.items?.map((link, linkIndex) => {
    return formatLink(link, linkIndex, columnId, hostUrl)
  })
}

const formatFooterColumns = (data, hostUrl): FooterLink[] => {
  const columns = data?.tree.map((column, index) => {
    return formatColumn(column, index + 1, hostUrl)
  })

  return columns.flat()
}

// This function assembles footer data from drupal menus into the shape vets-website component expects
export const buildFooterData = ({
  footerBottomRail,
  footerColumns,
}: RawFooterData): FooterLink[] => {
  // Use the SITE_URL with a fallback in the event it is missing.
  const hostUrl = 'https://www.va.gov/'

  // Assemble footer menu data from Drupal
  const footerBottomRailData =
    formatColumn(footerBottomRail, 'bottom_rail', hostUrl) || []
  const footerColumnsData = formatFooterColumns(footerColumns, hostUrl) || []

  const footerData = [
    ...footerBottomRailData,
    ...footerColumnsData,
    ...FOOTER_LINKS,
  ]

  return footerData
}
