import { buildSideNavDataFromMenu } from './facilitySideNav'
import { Menu } from '@/types/drupal/menu'
import { SideNavMenu } from '@/types/formatted/sideNav'
import lovellMenu from '@/mocks/lovellMenu.mock.json'

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
    function getLinkByLabel(sideNavData: SideNavMenu, label: string) {
      const findLink = (links: SideNavMenu['data']['links']) => {
        for (const link of links) {
          if (link.label === label) {
            return link
          }
          if (link.links) {
            const result = findLink(link.links)
            if (result) {
              return result
            }
          }
        }
        return null
      }

      return findLink(sideNavData.data?.links)?.url.path
    }

    it('transforms URLs for TRICARE variant', () => {
      const sideNavData = buildSideNavDataFromMenu(
        '/lovell-federal-health-care-tricare',
        lovellMenu as unknown as Menu
      )
      expect(getLinkByLabel(sideNavData, 'Locations')).toEqual(
        '/lovell-federal-health-care-tricare/locations'
      )
      expect(getLinkByLabel(sideNavData, 'Stories')).toEqual(
        '/lovell-federal-health-care-tricare/stories'
      )
      expect(getLinkByLabel(sideNavData, 'News releases')).toEqual(
        '/lovell-federal-health-care-tricare/news-releases'
      )
    })

    it('transforms URLs for VA variant', () => {
      const sideNavData = buildSideNavDataFromMenu(
        '/lovell-federal-health-care-va',
        lovellMenu as unknown as Menu
      )
      expect(getLinkByLabel(sideNavData, 'Stories')).toEqual(
        '/lovell-federal-health-care-va/stories'
      )
      expect(getLinkByLabel(sideNavData, 'News releases')).toEqual(
        '/lovell-federal-health-care-va/news-releases'
      )
    })
  })
})
