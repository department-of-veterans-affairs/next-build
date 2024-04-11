/**
 * @jest-environment node
 */

import {
  getArrayDepth,
  convertLinkToAbsolute,
  formatHeaderData,
  makeColumns,
} from './header'

describe('header.ts utilities', () => {
  describe('getArrayDepth', () => {
    it('returns 0 for empty arrays', () => {
      expect(getArrayDepth({})).toBe(0)
    })

    it('returns correct depth for nested arrays', () => {
      const mockData = {
        items: [
          {
            items: [{ items: [{}] }, {}],
          },
          {
            items: [],
          },
        ],
      }
      expect(getArrayDepth(mockData)).toBe(3)
    })
    it('calculates depth accurately for uneven nested arrays', () => {
      const unevenMockData = {
        items: [
          {
            items: [{}],
          },
          {}, // This creates an uneven depth
        ],
      }
      expect(getArrayDepth(unevenMockData)).toBe(2)
    })
  })

  describe('convertLinkToAbsolute', () => {
    it('converts a relative path to an absolute URL', () => {
      const hostUrl = 'https://va.gov'
      const pathName = '/test-path'
      const expectedUrl = 'https://va.gov/test-path'
      expect(convertLinkToAbsolute(hostUrl, pathName)).toBe(expectedUrl)
    })

    it('handles full URLs correctly', () => {
      const hostUrl = 'https://va.gov'
      const fullUrl = 'https://example.com/test'
      expect(convertLinkToAbsolute(hostUrl, fullUrl)).toBe(fullUrl)
    })
    it('handles paths without a leading slash', () => {
      const hostUrl = 'https://va.gov'
      const pathName = 'test-path-without-slash'
      expect(convertLinkToAbsolute(hostUrl, pathName)).toBe(
        'https://va.gov/test-path-without-slash'
      )
    })

    it('prevents double appending of host URL', () => {
      const hostUrl = 'https://va.gov'
      const fullPath = 'https://va.gov/test-path'
      expect(convertLinkToAbsolute(hostUrl, fullPath)).toBe(fullPath)
    })
  })

  describe('formatHeaderData', () => {
    it('formats complex menu data correctly', () => {
      const mockMenuData = {
        tree: [
          {
            title: 'Top-Level Menu 1',
            url: '/top-level-menu-1',
            items: [
              {
                title: 'Second-Level Menu 1',
                url: '/top-level-menu-1/second-level-menu-1',
                items: [
                  {
                    title: 'Third-Level Menu 1',
                    url: '/top-level-menu-1/second-level-menu-1/third-level-menu-1',
                    items: [],
                  },
                ],
              },
            ],
          },
          {
            title: 'Top-Level Menu 2',
            url: '',
            items: [
              {
                title: 'Second-Level Menu 2',
                url: '/top-level-menu-2/second-level-menu-2',
                items: [],
                field_promo_reference: {
                  id: 'promo-2',
                },
              },
            ],
          },
        ],
      }
      const hostUrl = 'https://va.gov'
      const result = formatHeaderData(mockMenuData, hostUrl)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].title).toBeDefined()
      expect(result[0].href).toBeDefined()

      // Check for the transformation of URLs
      result.forEach((section) => {
        if (section.href) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(section.href.startsWith('https://')).toBeTruthy()
        }
      })

      // Check for the presence of menuSections in any form
      const sectionsWithMenuSections = result.filter(
        (section) => section.menuSections !== undefined
      )
      expect(sectionsWithMenuSections.length).toBeGreaterThan(0)
    })
  })
})

it('creates seeAllLink correctly when applicable', () => {
  const hostUrl = 'https://va.gov'
  const linkData = [{ title: 'See All Link', url: '/see-all', items: [] }]
  const arrayDepth = 3

  const result = makeColumns(hostUrl, linkData, arrayDepth, null)
  expect(result).toHaveProperty('seeAllLink')
  expect(result.seeAllLink.href).toContain('/see-all')
})

it('creates columns with titles and links correctly', () => {
  const hostUrl = 'https://va.gov'
  const linkData = [
    {
      title: 'Main Column',
      items: [{ title: 'Link 1', url: '/link1' }],
    },
  ]
  const arrayDepth = 2

  const result = makeColumns(hostUrl, linkData, arrayDepth, null)
  expect(result).toHaveProperty('mainColumn')
  expect(result.mainColumn.title).toBe('Main Column')
  //@ts-expect-error for testing
  expect(result.mainColumn.links.length).toBeGreaterThan(0)
})
