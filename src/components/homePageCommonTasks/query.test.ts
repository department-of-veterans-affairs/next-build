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
})
