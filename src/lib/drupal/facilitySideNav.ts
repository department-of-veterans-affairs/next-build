import { Menu, MenuItem } from '@/types/drupal/menu'
import {
  SideNavData,
  SideNavItem,
  SideNavMenu,
} from '@/types/formatted/sideNav'
import { LovellVariant } from '@/lib/drupal/lovell/types'
import { getLovellVariantOfUrl } from './lovell/utils'

// Recursively fit menu items into sidenav-requested shape
const normalizeMenuItem = (
  item: MenuItem,
  variant?: LovellVariant
): SideNavItem => {
  const nestedItems = []

  if (item.items && item.items.length > 0) {
    item.items.forEach((i) => nestedItems.push(normalizeMenuItem(i, variant)))
  }

  // Transform URL if Lovell variant is specified
  const path = variant ? getLovellVariantOfUrl(item.url, variant) : item.url
  return {
    description: item.description,
    expanded: item.expanded,
    label: item.title,
    links: nestedItems,
    url: { path },
    // Add Lovell-specific section info if available
    lovellSection: item.field_menu_section || null,
  }
}

const normalizeMenuData = (
  menu: Menu,
  variant?: LovellVariant
): SideNavData => {
  // Bail early if no tree is provided
  if (!menu || !menu.tree || menu.tree.length === 0) return null

  const links = []
  menu.tree.forEach((item) => {
    return links.push(normalizeMenuItem(item, variant))
  })
  return {
    name: menu.tree[0].title,
    description: menu.tree[0].description,
    links,
  }
}

/* Use this function in @data/queries/* formatters to shape JSON:API menu endpoint data
 into the structure that the sidenav widget from vets-website expects
 See: /vets-website/blob/main/src/platform/site-wide/side-nav/index.js & helpers.js
*/
export const buildSideNavDataFromMenu = (
  entityPath: string,
  menu: Menu,
  variant?: LovellVariant
): SideNavMenu => {
  const data = normalizeMenuData(menu, variant)
  return {
    rootPath: `${entityPath}/`,
    data,
  }
}
