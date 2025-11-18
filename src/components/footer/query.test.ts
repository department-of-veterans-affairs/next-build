/**
 * @jest-environment node
 */

import { formatter, data, RawFooterData } from './query'
import { Menu } from '@/types/drupal/menu'
import { getMenu } from '@/lib/drupal/query'

// Mock the getMenu function
jest.mock('@/lib/drupal/query', () => ({
  getMenu: jest.fn(),
}))

const mockGetMenu = getMenu as jest.MockedFunction<typeof getMenu>

describe('Footer query', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('data function', () => {
    it('should fetch footer columns and bottom rail menus', async () => {
      const mockFooterColumns: Menu = {
        items: [],
        tree: [],
      }
      const mockFooterBottomRail: Menu = {
        items: [],
        tree: [],
      }

      mockGetMenu.mockResolvedValueOnce(mockFooterColumns)
      mockGetMenu.mockResolvedValueOnce(mockFooterBottomRail)

      const result = await data(null)

      expect(mockGetMenu).toHaveBeenCalledTimes(2)
      expect(mockGetMenu).toHaveBeenCalledWith('va-gov-footer')
      expect(mockGetMenu).toHaveBeenCalledWith('footer-bottom-rail')
      expect(result).toEqual({
        footerColumns: mockFooterColumns,
        footerBottomRail: mockFooterBottomRail,
      })
    })
  })

  describe('formatter function', () => {
    it('should format footer data with complete menu structure', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [
            {
              id: '1',
              url: '/about-va',
              title: 'About VA',
              items: [
                {
                  id: '1-1',
                  url: '/about-va/history',
                  title: 'History',
                },
                {
                  id: '1-2',
                  url: '/about-va/mission',
                  title: 'Mission',
                  options: {
                    attributes: {
                      target: '_blank',
                    },
                  },
                },
              ],
            },
            {
              id: '2',
              url: '/benefits',
              title: 'Benefits',
              items: [
                {
                  id: '2-1',
                  url: '/benefits/health-care',
                  title: 'Health Care',
                },
              ],
            },
          ],
        },
        footerBottomRail: {
          items: [
            {
              id: 'bottom-1',
              url: '/privacy',
              title: 'Privacy Policy',
            },
            {
              id: 'bottom-2',
              url: '/accessibility',
              title: 'Accessibility',
              options: {
                attributes: {
                  target: '_self',
                },
              },
            },
          ],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)

      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)

      // Check footer columns (column 1 and 2)
      const column1Links = result.filter((link) => link.column === 1)
      expect(column1Links).toHaveLength(2)
      expect(column1Links[0]).toMatchObject({
        column: 1,
        href: 'https://www.va.gov/about-va/history',
        order: 1,
        target: null,
        title: 'History',
      })
      expect(column1Links[1]).toMatchObject({
        column: 1,
        href: 'https://www.va.gov/about-va/mission',
        order: 2,
        target: '_blank',
        title: 'Mission',
      })

      const column2Links = result.filter((link) => link.column === 2)
      expect(column2Links).toHaveLength(1)
      expect(column2Links[0]).toMatchObject({
        column: 2,
        href: 'https://www.va.gov/benefits/health-care',
        order: 1,
        target: null,
        title: 'Health Care',
      })

      // Check bottom rail links
      const bottomRailLinks = result.filter(
        (link) => link.column === 'bottom_rail'
      )
      expect(bottomRailLinks).toHaveLength(2)
      expect(bottomRailLinks[0]).toMatchObject({
        column: 'bottom_rail',
        href: 'https://www.va.gov/privacy',
        order: 1,
        target: null,
        title: 'Privacy Policy',
      })
      expect(bottomRailLinks[1]).toMatchObject({
        column: 'bottom_rail',
        href: 'https://www.va.gov/accessibility',
        order: 2,
        target: '_self',
        title: 'Accessibility',
      })

      // Check that FOOTER_LINKS are included
      const footerLinks = result.filter((link) => link.column === 4)
      expect(footerLinks.length).toBeGreaterThan(0)
    })

    it('should handle empty footer columns', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [],
        },
        footerBottomRail: {
          items: [
            {
              id: 'bottom-1',
              url: '/privacy',
              title: 'Privacy Policy',
            },
          ],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)

      const columnLinks = result.filter(
        (link) => typeof link.column === 'number' && link.column < 4
      )
      expect(columnLinks).toHaveLength(0)

      const bottomRailLinks = result.filter(
        (link) => link.column === 'bottom_rail'
      )
      expect(bottomRailLinks).toHaveLength(1)
    })

    it('should handle empty footer bottom rail', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [
            {
              id: '1',
              url: '/about-va',
              title: 'About VA',
              items: [
                {
                  id: '1-1',
                  url: '/about-va/history',
                  title: 'History',
                },
              ],
            },
          ],
        },
        footerBottomRail: {
          items: [],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)

      const bottomRailLinks = result.filter(
        (link) => link.column === 'bottom_rail'
      )
      expect(bottomRailLinks).toHaveLength(0)

      const columnLinks = result.filter((link) => link.column === 1)
      expect(columnLinks).toHaveLength(1)
    })

    it('should handle column with empty items array', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [
            {
              id: '1',
              url: '/about-va',
              title: 'About VA',
              items: [],
            },
          ],
        },
        footerBottomRail: {
          items: [],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)

      const columnLinks = result.filter((link) => link.column === 1)
      expect(columnLinks).toHaveLength(0)
    })

    it('should handle multiple columns with multiple links', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [
            {
              id: '1',
              url: '/col1',
              title: 'Column 1',
              items: [
                { id: '1-1', url: '/col1-link1', title: 'Link 1' },
                { id: '1-2', url: '/col1-link2', title: 'Link 2' },
                { id: '1-3', url: '/col1-link3', title: 'Link 3' },
              ],
            },
            {
              id: '2',
              url: '/col2',
              title: 'Column 2',
              items: [
                { id: '2-1', url: '/col2-link1', title: 'Link 1' },
                { id: '2-2', url: '/col2-link2', title: 'Link 2' },
              ],
            },
            {
              id: '3',
              url: '/col3',
              title: 'Column 3',
              items: [{ id: '3-1', url: '/col3-link1', title: 'Link 1' }],
            },
          ],
        },
        footerBottomRail: {
          items: [],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)

      expect(result.filter((link) => link.column === 1)).toHaveLength(3)
      expect(result.filter((link) => link.column === 2)).toHaveLength(2)
      expect(result.filter((link) => link.column === 3)).toHaveLength(1)
    })

    it('should handle relative and absolute URLs correctly', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [
            {
              id: '1',
              url: '/about-va',
              title: 'About VA',
              items: [
                {
                  id: '1-1',
                  url: '/relative-path',
                  title: 'Relative Path',
                },
                {
                  id: '1-2',
                  url: 'https://external.com/page',
                  title: 'External URL',
                },
              ],
            },
          ],
        },
        footerBottomRail: {
          items: [],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)

      const relativeLink = result.find((link) => link.title === 'Relative Path')
      expect(relativeLink?.href).toBe('https://www.va.gov/relative-path')

      const externalLink = result.find((link) => link.title === 'External URL')
      expect(externalLink?.href).toBe('https://external.com/page')
    })

    it('should preserve order of links within columns', () => {
      const rawData = {
        footerColumns: {
          items: [],
          tree: [
            {
              id: '1',
              url: '/col1',
              title: 'Column 1',
              items: [
                { id: '1-1', url: '/first', title: 'First' },
                { id: '1-2', url: '/second', title: 'Second' },
                { id: '1-3', url: '/third', title: 'Third' },
              ],
            },
          ],
        },
        footerBottomRail: {
          items: [],
          tree: [],
        },
      } as RawFooterData

      const result = formatter(rawData)
      const column1Links = result.filter((link) => link.column === 1)

      expect(column1Links[0].order).toBe(1)
      expect(column1Links[0].title).toBe('First')
      expect(column1Links[1].order).toBe(2)
      expect(column1Links[1].title).toBe('Second')
      expect(column1Links[2].order).toBe(3)
      expect(column1Links[2].title).toBe('Third')
    })

    it('should handle empty footerColumns.tree array', () => {
      const rawData: RawFooterData = {
        footerColumns: {
          items: [],
          tree: [],
        },
        footerBottomRail: {
          items: [],
          tree: [],
        },
      }

      const result = formatter(rawData)

      // Should return FOOTER_LINKS at minimum
      expect(result).toBeInstanceOf(Array)
      const columnLinks = result.filter(
        (link) => typeof link.column === 'number' && link.column < 4
      )
      expect(columnLinks).toHaveLength(0)
    })
  })
})
