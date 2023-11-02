import { Menu, MenuItem } from '@/types/dataTypes/drupal/menu'
import { SideNavData, SideNavItem, SideNavMenu } from '@/types/index'

// Recursively fit menu items into sidenav-requested shape
const normalizeMenuItem = (item: MenuItem): SideNavItem => {
  const nestedItems = []

  if (item.items && item.items.length > 0) {
    item.items.forEach((i) => nestedItems.push(normalizeMenuItem(i)))
  }
  return {
    description: item.description,
    expanded: item.expanded,
    label: item.title,
    links: nestedItems,
    url: { path: item.url },
    fieldMenuSection: item.field_menu_section || null,
  }
}

const normalizeMenuData = (menu: Menu): SideNavData => {
  // Bail early if no tree is provided
  if (!menu.tree || menu.tree.length === 0) return null

  const links = []
  menu.tree.forEach((item) => {
    return links.push(normalizeMenuItem(item))
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
  menu: Menu
): SideNavMenu => {
  const data = normalizeMenuData(menu)
  return {
    rootPath: `${entityPath}/`,
    data,
  }
}
