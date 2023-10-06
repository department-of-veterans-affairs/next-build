import { convertLinkToAbsolute, formatHeaderData } from '@/lib/utils/header'
import { FOOTER_LINKS } from '../constants/footer-links'
import { RawHeaderFooterData } from '@/data/queries/headerFooter'
import { FooterLink, HeaderFooterData } from '@/types/index'

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

// This function assembles the header and footer data from drupal menus into the shape vets-website component expects
// see @content-build/src/site/stages/build/plugins/create-header-footer.js
export const buildHeaderFooterData = ({
  footerBottomRail,
  footerColumns,
  headerMegaMenu,
  promoBlocks,
}: RawHeaderFooterData): HeaderFooterData => {
  // todo: target env handling for what hostUrl should map to
  const hostUrl = 'https://va.gov/'

  // Assemble footer menu data from Drupal
  const footerBottomRailData =
    formatColumn(footerBottomRail, 'bottom_rail', hostUrl) || []
  const footerColumnsData = formatFooterColumns(footerColumns, hostUrl) || []

  const footerData = [
    ...footerBottomRailData,
    ...footerColumnsData,
    ...FOOTER_LINKS,
  ]

  // Assemble header megamenu data from Drupal
  const megaMenuData = formatHeaderData(headerMegaMenu, hostUrl, promoBlocks)

  // Data shaped into what front-end widgets expect
  return {
    footerData,
    megaMenuData,
  }
}
