/* eslint-disable no-param-reassign */

import { queries } from '@/data/queries'
import {
  MegaMenuColumn,
  MegaMenuLink,
  MegaMenuLinkObject,
  MegaMenuSection,
} from '@/types/dataTypes/formatted/headerFooter'

/**
 * Most of this file is to massage the data for the menu links
 * to match the structure in `vetsgov-content` so the mega
 * menu React component successfully renders all the links.
 *
 * It's a little simplified from the content-build approach because
 * we get an already-constructed menu tree from next-drupal, only need
 * to move some object key values around.
 *
 * See: @content-build/src/site/stages/build/drupal/menus.js
 */

export function getArrayDepth(arr): number {
  const counter = (curArr) =>
    curArr?.items ? Math.max(...curArr.items.map(counter)) + 1 : 0
  return counter(arr)
}

export function convertLinkToAbsolute(hostUrl, pathName): string {
  const url = new URL(pathName, hostUrl)
  return url.href
}

function createLinkObj(hostUrl, link): MegaMenuLink {
  return {
    text: link.title,
    href: convertLinkToAbsolute(hostUrl, link.url),
  }
}

function makeLinkList(hostUrl, links): MegaMenuLink[] {
  const list = []

  links.forEach((link) => {
    const linkObj = createLinkObj(hostUrl, link)
    list.push(linkObj)
  })

  return list
}

/**
 * Make a set of link columns in the megaMenu from a set of link data.
 *
 *
 * The JSON format consumed by the megaMenu widget has a set of column names
 * that it uses, e.g., "mainColumn," "columnOne."
 *
 * With some exceptions, each column has a title and a list of links under that title.
 *
 * Exception 1: A column may also contain a promo block. If so, we call a function to create
 * that block.
 *
 * Exception 2: If a 'column' does not have any child links, then this is a special
 * case: the seeAllLink, which is used to link to a hub landing page.
 *
 * @param {string} hostUrl - Absolute url for the site.
 * @param {Array} linkData - A set of links to be divided into columns.
 * @param {number} arrayDepth - Total depth of the parent tab.
 * @param {object} promo - Information for promo block column
 *
 * @return {Array} columns - A set of columns formatted correctly for the megaMenu React widget.
 */
function makeColumns(hostUrl, linkData, arrayDepth, promo): MegaMenuLinkObject {
  const columns: MegaMenuLinkObject = {}
  const columnNames = [
    // Possible column names.
    'mainColumn',
    'columnOne',
    'columnTwo',
    'columnThree',
    'columnFour',
  ]
  let i = 1

  // I'm not sure why it's set up this way, but the About VA (arrayDepth = 2)
  // tab starts with 'mainColumn.'
  if (arrayDepth < 3) {
    i = 0
  }

  linkData.forEach((link) => {
    // Create named columns.
    if (link.items && link.items.length > 0) {
      const column = {
        title: link.title,
        links: makeLinkList(hostUrl, link.items),
      }
      columns[columnNames[i]] = column
      i++

      // If we have no children, then this is the 'See all' link.
      // This also means we will have a promo block related to this hub.
    } else if (arrayDepth === 3) {
      columns.seeAllLink = createLinkObj(hostUrl, link)
    }

    // Generate promo block column if present
    if (promo && promo.id) {
      columns[columnNames[i]] = queries.formatData(
        'block_content--promo',
        promo
      )
    }
  })

  return columns
}

const makeSection = (item, hostUrl, arrayDepth): MegaMenuColumn => {
  const sections = item.items
  const promo = item.field_promo_reference

  return {
    title: item.title,
    links: makeColumns(hostUrl, sections, arrayDepth, promo),
  }
}

export function formatHeaderData(menuData, hostUrl): MegaMenuSection[] {
  const megaMenuTree = []
  menuData.tree.forEach((link) => {
    const linkObj: MegaMenuSection = { title: link.title }

    // If this top-level item has a link, add it.
    if (link.url !== '') {
      linkObj.href = convertLinkToAbsolute(hostUrl, link.url)
    }

    // If we have children, add in menuSections.
    if (link.items && link.items.length > 0) {
      const arrayDepth = getArrayDepth(link)

      // For the deepest tabs, like our hub tab.
      // We have an extra left column that defines 'sections', which in practical terms are hubs.
      if (arrayDepth === 3) {
        linkObj.menuSections = []
        link.items.forEach((child) => {
          // These are hubs with child links.
          if (child.items?.length > 0) {
            if (Array.isArray(linkObj.menuSections)) {
              linkObj.menuSections.push(makeSection(child, hostUrl, arrayDepth))
            }
          } else {
            // 2 hubs just have a single link. Unlike the usual pattern, these
            // must have both 'title' and 'text' properties in addition to 'href'.
            const childLinkObj = {
              title: child.title,
              ...createLinkObj(hostUrl, child),
            }
            if (Array.isArray(linkObj.menuSections)) {
              linkObj.menuSections.push(childLinkObj)
            }
          }
        })
      } else {
        const promo = link.field_promo_reference
        linkObj.menuSections = makeColumns(
          hostUrl,
          link.items,
          arrayDepth,
          promo
        )
      }
    }

    // Add re-constructed object to array that is returned.
    megaMenuTree.push(linkObj)
  })

  return megaMenuTree
}
