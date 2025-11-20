/**
 * @jest-environment node
 */

import {
  getArrayDepth,
  convertLinkToAbsolute,
  formatHeaderData,
  makeColumns,
} from './header'
import { MegaMenuPromoColumn } from '@/components/header/formatted-type'

// Mock promo block data that matches the structure expected by queries.formatData
// Using 'as any' since we only need the fields that the formatter uses
const createMockPromoBlock = () => ({
  type: 'block_content--promo',
  id: 'test-promo-id',
  drupal_internal__id: 1,
  field_image: {
    image: {
      links: {
        '3_2_medium_thumbnail': {
          href: 'https://va.gov/sites/default/files/promo-image.jpg',
        },
      },
      resourceIdObjMeta: {
        alt: 'Promo image alt text',
      },
    },
  },
  field_promo_link: {
    field_link: {
      title: 'Promo Link Title',
      uri: 'https://va.gov/promo-link',
    },
    field_link_summary: 'Promo description text',
  },
})

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

  expect(result.mainColumn.links).toBeDefined()
  expect(Array.isArray(result.mainColumn.links)).toBe(true)
  expect((result.mainColumn.links as unknown[]).length).toBeGreaterThan(0)
})

describe('makeColumns with promo block', () => {
  it('creates promo block column when promo is provided with id', () => {
    const hostUrl = 'https://va.gov'
    const linkData = [
      {
        title: 'Main Column',
        items: [{ title: 'Link 1', url: '/link1' }],
      },
    ]
    const arrayDepth = 2
    const promo = createMockPromoBlock()

    const result = makeColumns(hostUrl, linkData, arrayDepth, promo)

    expect(result).toHaveProperty('mainColumn')
    expect(result.mainColumn.title).toBe('Main Column')
    expect(result).toHaveProperty('columnOne')
    // Verify the promo was formatted correctly
    // columnOne should be MegaMenuPromoColumn when it's a promo
    const promoColumn = result.columnOne as unknown as MegaMenuPromoColumn
    expect(promoColumn).toHaveProperty('img')
    expect(promoColumn).toHaveProperty('link')
    expect(promoColumn).toHaveProperty('description')
    expect(promoColumn.img.src).toBe(
      'https://va.gov/sites/default/files/promo-image.jpg'
    )
    expect(promoColumn.img.alt).toBe('Promo image alt text')
    expect(promoColumn.link.text).toBe('Promo Link Title')
    expect(promoColumn.link.href).toBe('https://va.gov/promo-link')
    expect(promoColumn.description).toBe('Promo description text')
  })
})

describe('formatHeaderData with arrayDepth === 3', () => {
  it('creates menuSections array with makeSection when children have items', () => {
    const mockMenuData = {
      tree: [
        {
          title: 'Hub Tab',
          url: '/hub-tab',
          items: [
            {
              title: 'Hub Section 1',
              items: [
                {
                  title: 'Hub Link 1',
                  url: '/hub-link-1',
                  items: [{ title: 'Child Link', url: '/child-link' }],
                },
              ],
              field_promo_reference: createMockPromoBlock(),
            },
          ],
        },
      ],
    }

    const hostUrl = 'https://va.gov'
    const result = formatHeaderData(mockMenuData, hostUrl)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Hub Tab')
    expect(result[0].menuSections).toBeDefined()
    expect(Array.isArray(result[0].menuSections)).toBe(true)

    const menuSections = result[0].menuSections as Array<unknown>
    expect(menuSections.length).toBeGreaterThan(0)

    // Verify makeSection was called (indirectly) by checking structure
    const firstSection = menuSections[0] as {
      title: string
      links: unknown
    }
    expect(firstSection.title).toBe('Hub Section 1')
    expect(firstSection.links).toBeDefined()
  })

  it('creates menuSections with childLinkObj when children have no items', () => {
    // For arrayDepth === 3, we need 3 levels of nesting in at least one path.
    // We'll have one child with items (to ensure depth 3) and one without (to test the else branch).
    const mockMenuData = {
      tree: [
        {
          title: 'Hub Tab',
          url: '/hub-tab',
          items: [
            {
              title: 'Hub Section With Items',
              items: [
                {
                  title: 'Hub Link',
                  url: '/hub-link',
                  items: [{ title: 'Child Link', url: '/child-link' }],
                },
              ],
            },
            {
              title: 'Single Hub Link',
              url: '/single-hub-link',
              // No items property - this will test the else branch
            },
          ],
        },
      ],
    }

    const hostUrl = 'https://va.gov'
    const result = formatHeaderData(mockMenuData, hostUrl)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Hub Tab')
    expect(result[0].menuSections).toBeDefined()
    expect(Array.isArray(result[0].menuSections)).toBe(true)

    const menuSections = result[0].menuSections as Array<unknown>
    expect(menuSections.length).toBe(2)

    // First should be a section (from makeSection)
    const firstSection = menuSections[0] as {
      title: string
      links: unknown
    }
    expect(firstSection.title).toBe('Hub Section With Items')

    // Second should be a childLinkObj (has title, text, and href)
    const childLink = menuSections[1] as {
      title: string
      text: string
      href: string
    }
    expect(childLink.title).toBe('Single Hub Link')
    expect(childLink.text).toBe('Single Hub Link')
    expect(childLink.href).toBe('https://va.gov/single-hub-link')
  })

  it('handles mixed children: some with items, some without', () => {
    const mockMenuData = {
      tree: [
        {
          title: 'Hub Tab',
          url: '/hub-tab',
          items: [
            {
              title: 'Hub Section With Items',
              items: [
                {
                  title: 'Hub Link',
                  url: '/hub-link',
                  items: [{ title: 'Child Link', url: '/child-link' }],
                },
              ],
              field_promo_reference: createMockPromoBlock(),
            },
            {
              title: 'Single Hub Link',
              url: '/single-hub-link',
              items: [],
            },
          ],
        },
      ],
    }

    const hostUrl = 'https://va.gov'
    const result = formatHeaderData(mockMenuData, hostUrl)

    expect(result).toHaveLength(1)
    expect(result[0].menuSections).toBeDefined()
    expect(Array.isArray(result[0].menuSections)).toBe(true)

    const menuSections = result[0].menuSections as Array<unknown>
    expect(menuSections.length).toBe(2)

    // First should be a section (from makeSection)
    const firstSection = menuSections[0] as {
      title: string
      links: unknown
    }
    expect(firstSection.title).toBe('Hub Section With Items')

    // Second should be a childLinkObj
    const secondLink = menuSections[1] as {
      title: string
      text: string
      href: string
    }
    expect(secondLink.title).toBe('Single Hub Link')
    expect(secondLink.text).toBe('Single Hub Link')
    expect(secondLink.href).toBe('https://va.gov/single-hub-link')
  })
})
