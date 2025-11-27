/**
 * @jest-environment node
 */

import { Menu, MenuItem } from '@/types/drupal/menu'
import { queries } from '@/lib/drupal/queries'

function createMockItem({
  id,
  url,
  title,
}: Pick<MenuItem, 'id' | 'url' | 'title'>): MenuItem {
  return {
    id,
    url,
    title,
    expanded: false,
    enabled: true,
  }
}

const defaultPopularMenu = {
  items: [
    createMockItem({ id: '1', url: '/health-care', title: 'Health Care' }),
    createMockItem({ id: '2', url: '/benefits', title: 'Benefits' }),
  ],
  tree: [],
} as Menu

const defaultSearchMenu = {
  items: [
    createMockItem({
      id: '3',
      url: '/find-locations',
      title: 'Find Locations',
    }),
    createMockItem({ id: '4', url: '/contact-us', title: 'Contact Us' }),
  ],
  tree: [],
} as Menu

// Mock the getMenu function
jest.mock('@/lib/drupal/query', () => ({
  getMenu: jest.fn((menuName: string) => {
    switch (menuName) {
      case 'popular-on-va-gov':
        return defaultPopularMenu
      case 'other-search-tools':
        return defaultSearchMenu
      default:
        return { items: [], tree: [] }
    }
  }),
}))

describe('HomePageCommonTasks query', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('outputs formatted data', async () => {
    expect(await queries.getData('home-page-common-tasks')).toMatchSnapshot()
  })

  it('should preserve order of menu items', async () => {
    const result = await queries.getData('home-page-common-tasks')

    expect(result.popularLinks[0].url).toBe('/health-care')
    expect(result.popularLinks[1].url).toBe('/benefits')
    expect(result.searchLinks[0].url).toBe('/find-locations')
    expect(result.searchLinks[1].url).toBe('/contact-us')
  })
})
