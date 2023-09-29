import { Menu } from '@/types/dataTypes/drupal/menu'
import { convertLinkToAbsolute } from './helpers'
import { FOOTER_LINKS } from '../constants'

const formatLink = (link, linkIndex, columnId, hostUrl) => {
  return {
    column: columnId,
    href: convertLinkToAbsolute(hostUrl, link?.url?.path),
    order: linkIndex + 1,
    target: null,
    title: link?.label,
  }
}

const formatColumn = (data, columnId, hostUrl) => {
  return data?.items?.map((link, linkIndex) =>
    formatLink(link, linkIndex, columnId, hostUrl)
  )
}

const formatFooterColumns = (data, hostUrl) => {
  return data?.links?.reduce?.(
    (acc, column, columnIndex) => [
      ...acc,
      ...formatColumn(column, columnIndex + 1, hostUrl),
    ],
    []
  )
}

// This function assembles the header and footer data from drupal menus into the shape vets-website component expects
// see @content-build/src/site/stages/build/plugins/create-header-footer.js
export const buildHeaderFooterData = (bottomRail: Menu, footer: Menu) => {
  const bottomRailFooterData =
    formatColumn(bottomRail, 'bottom_rail', 'http://va.gov/') || []
  const footerColumnsData = formatFooterColumns(footer, 'http://va.gov/') || []

  const footerData = [
    ...bottomRailFooterData,
    ...footerColumnsData,
    ...FOOTER_LINKS,
  ]

  return {
    footerData,
    megaMenuData: [],
  }
}
