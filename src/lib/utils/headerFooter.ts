import { convertLinkToAbsolute, formatHeaderData } from '@/lib/utils/header'
import { FOOTER_LINKS } from '../constants/footer-links'
import {
  HeaderFooterData,
  RawHeaderFooterData,
} from '@/data/queries/headerFooter'

// Helper functions to format footer menu items
const formatLink = (link, linkIndex, columnId, hostUrl) => {
  return {
    column: columnId,
    href: convertLinkToAbsolute(hostUrl, link.url),
    order: linkIndex + 1,
    target: link?.options?.attributes?.target || null,
    title: link.title,
  }
}

const formatColumn = (data, columnId, hostUrl) => {
  return data?.items?.map((link, linkIndex) => {
    return formatLink(link, linkIndex, columnId, hostUrl)
  })
}

const formatFooterColumns = (data, hostUrl) => {
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
  megaMenu,
}: RawHeaderFooterData): HeaderFooterData => {
  // todo: target env handling for what hostUrl should map to
  const hostUrl = 'https://va.gov/'

  // Assemble footer menu data
  const bottomRailFooterData =
    formatColumn(footerBottomRail, 'bottom_rail', hostUrl) || []
  const footerColumnsData = formatFooterColumns(footerColumns, hostUrl) || []

  const footerData = [
    ...bottomRailFooterData,
    ...footerColumnsData,
    ...FOOTER_LINKS,
  ]

  // Assemble megamenu data
  const megaMenuData = formatHeaderData(megaMenu, hostUrl)

  return {
    footerData,
    megaMenuData,
  }
}
