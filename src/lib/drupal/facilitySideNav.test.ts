import { buildSideNavDataFromMenu } from './facilitySideNav'
import { Menu } from '@/types/drupal/menu'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { LOVELL } from './lovell/constants'
import { LovellVariant } from './lovell/types'

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
      menu_name: 'test-menu',
      provider: 'menu_link_content',
      weight: '0',
      options: {},
      route: {
        name: 'entity.node.canonical',
        parameters: {},
      },
      type: 'menu_link_content',
      meta: {},
      parent: '',
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

  describe('Lovell variant URL transformation', () => {
    const lovellMenu: Partial<Menu> = {
      items: [],
      tree: [
        {
          id: '1',
          url: '/lovell-federal-health-care/stories',
          title: 'Test Title',
          description: 'Test Description',
          expanded: true,
          enabled: true,
          field_menu_section: 'Test Section',
          items: [
            {
              id: '2',
              url: '/lovell-federal-health-care/news',
              title: 'Nested Item',
              description: 'Nested Description',
              expanded: false,
              enabled: true,
              field_menu_section: null,
              items: [],
              menu_name: 'test-menu',
              provider: 'menu_link_content',
              weight: '0',
              options: {},
              route: {
                name: 'entity.node.canonical',
                parameters: {},
              },
              type: 'menu_link_content',
              meta: {},
              parent: '',
            },
          ],
          menu_name: 'test-menu',
          provider: 'menu_link_content',
          weight: '0',
          options: {},
          route: {
            name: 'entity.node.canonical',
            parameters: {},
          },
          type: 'menu_link_content',
          meta: {},
          parent: '',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any[], // Use 'any[]' to bypass detailed type requirements
    }

    it('transforms URLs for TRICARE variant', () => {
      const sideNavData = buildSideNavDataFromMenu(
        '/test-path',
        lovellMenu as Menu,
        LOVELL.tricare.variant as LovellVariant
      )
      expect(sideNavData.data?.links[0].url.path).toEqual(
        '/lovell-federal-health-care-tricare/stories'
      )
      expect(sideNavData.data?.links[0].links[0].url.path).toEqual(
        '/lovell-federal-health-care-tricare/news'
      )
    })

    it('transforms URLs for VA variant', () => {
      const sideNavData = buildSideNavDataFromMenu(
        '/test-path',
        lovellMenu as Menu,
        LOVELL.va.variant as LovellVariant
      )
      expect(sideNavData.data?.links[0].url.path).toEqual(
        '/lovell-federal-health-care-va/stories'
      )
      expect(sideNavData.data?.links[0].links[0].url.path).toEqual(
        '/lovell-federal-health-care-va/news'
      )
    })

    it('preserves original URLs when no variant is provided', () => {
      const sideNavData = buildSideNavDataFromMenu(
        '/test-path',
        lovellMenu as Menu
      )
      expect(sideNavData.data?.links[0].url.path).toEqual(
        '/lovell-federal-health-care/stories'
      )
      expect(sideNavData.data?.links[0].links[0].url.path).toEqual(
        '/lovell-federal-health-care/news'
      )
    })

    it('recursively transforms URLs in nested menu items', () => {
      const sideNavData = buildSideNavDataFromMenu(
        '/test-path',
        lovellMenu as Menu,
        LOVELL.tricare.variant as LovellVariant
      )
      const firstItem = sideNavData.data?.links[0]
      expect(firstItem?.url.path).toEqual(
        '/lovell-federal-health-care-tricare/stories'
      )
      expect(firstItem?.links?.[0]?.url.path).toEqual(
        '/lovell-federal-health-care-tricare/news'
      )
    })
  })
})
