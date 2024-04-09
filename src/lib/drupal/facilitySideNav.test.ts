import { buildSideNavDataFromMenu } from './facilitySideNav' // Adjust the import path as necessary
import { Menu } from '@/types/drupal/menu'
import { SideNavMenu } from '@/types/formatted/sideNav'

const mockMenu: Partial<Menu> = {
  items: [],
  tree: [
    {
      id: '1',
      url: '/test-url',
      title: 'Test Title',
      description: 'Test Description',
      expanded: true,
      enabled: true,
      field_menu_section: 'Test Section',
      items: [], // Assuming it's a flat structure for simplicity
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any[], // Use 'any[]' to bypass detailed type requirements
}

describe('SideNav Data Building Function', () => {
  it('builds sidenav data from menu structure', () => {
    const entityPath = '/test-entity-path'
    const sideNavData: SideNavMenu = buildSideNavDataFromMenu(
      entityPath,
      mockMenu as Menu
    )

    expect(sideNavData).toBeDefined()
    expect(sideNavData.rootPath).toEqual(`${entityPath}/`)
    expect(sideNavData.data).toBeDefined()
    expect(sideNavData.data?.links.length).toBeGreaterThan(0)
    expect(sideNavData.data?.links[0].label).toEqual('Test Title')
    expect(sideNavData.data?.links[0].url.path).toEqual('/test-url')
  })

  it('returns null for empty menu tree', () => {
    const emptyMenu: Partial<Menu> = { items: [], tree: [] }
    const sideNavData: SideNavMenu = buildSideNavDataFromMenu(
      '/empty-path',
      emptyMenu as Menu
    )

    expect(sideNavData.data).toBeNull()
  })
})
