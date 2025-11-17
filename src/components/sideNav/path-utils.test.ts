import {
  normalizePath,
  pathsMatch,
  pathContains,
  findCurrentPathDepth,
} from './path-utils'
import { SideNavItem } from '@/types/formatted/sideNav'

describe('normalizePath', () => {
  it('removes trailing slash from paths', () => {
    expect(normalizePath('/test/')).toBe('/test')
    expect(normalizePath('/test/path/')).toBe('/test/path')
  })

  it('keeps root slash', () => {
    expect(normalizePath('/')).toBe('/')
  })

  it('does not modify paths without trailing slash', () => {
    expect(normalizePath('/test')).toBe('/test')
    expect(normalizePath('/test/path')).toBe('/test/path')
  })
})

describe('pathsMatch', () => {
  it('matches identical paths', () => {
    expect(pathsMatch('/test', '/test')).toBe(true)
    expect(pathsMatch('/test/path', '/test/path')).toBe(true)
  })

  it('matches paths with different trailing slashes', () => {
    expect(pathsMatch('/test/', '/test')).toBe(true)
    expect(pathsMatch('/test', '/test/')).toBe(true)
    expect(pathsMatch('/test/', '/test/')).toBe(true)
  })

  it('does not match different paths', () => {
    expect(pathsMatch('/test', '/other')).toBe(false)
    expect(pathsMatch('/test/path', '/test/other')).toBe(false)
  })
})

describe('pathContains', () => {
  it('returns true when path contains substring', () => {
    expect(pathContains('/test/path', '/test')).toBe(true)
    expect(pathContains('/test/path/deep', '/test/path')).toBe(true)
  })

  it('handles trailing slashes', () => {
    expect(pathContains('/test/path/', '/test')).toBe(true)
    expect(pathContains('/test/path', '/test/')).toBe(true)
  })

  it('returns false when path does not contain substring', () => {
    expect(pathContains('/test', '/other')).toBe(false)
    expect(pathContains('/test/path', '/other')).toBe(false)
  })
})

describe('findCurrentPathDepth', () => {
  // Helper to create a nav item
  const createNavItem = (
    label: string,
    path: string,
    children: SideNavItem[] = []
  ): SideNavItem => ({
    label,
    description: null,
    expanded: false,
    url: { path },
    links: children,
    lovellSection: null,
  })

  it('returns parent "Options and eligibility" for SGLI page', () => {
    // Simplified version of the life insurance menu structure
    const menu: SideNavItem[] = [
      createNavItem('Get benefits', '', [
        createNavItem(
          'Options and eligibility',
          '/life-insurance/options-eligibility',
          [
            createNavItem(
              "Servicemembers' Group (SGLI)",
              '/life-insurance/options-eligibility/sgli'
            ),
            createNavItem(
              "Family Servicemembers' Group (FSGLI)",
              '/life-insurance/options-eligibility/fsgli'
            ),
          ]
        ),
        createNavItem('Totally disabled', '/life-insurance/totally-disabled'),
      ]),
      createNavItem('Manage benefits', '', [
        createNavItem(
          'Access your policy',
          '/life-insurance/manage-your-policy'
        ),
      ]),
    ]

    const result = findCurrentPathDepth(
      menu,
      '/life-insurance/options-eligibility/sgli/'
    )

    expect(result.links).not.toBeNull()
    expect(result.links?.label).toBe('Options and eligibility')
    expect(result.depth).toBe(3)
  })

  it('returns parent when current page has trailing slash', () => {
    const menu: SideNavItem[] = [
      createNavItem('Parent', '/parent', [
        createNavItem('Child', '/parent/child'),
      ]),
    ]

    const result = findCurrentPathDepth(menu, '/parent/child/')

    expect(result.links?.label).toBe('Parent')
    expect(result.depth).toBe(2)
  })

  it('returns parent when menu item has trailing slash', () => {
    const menu: SideNavItem[] = [
      createNavItem('Parent', '/parent/', [
        createNavItem('Child', '/parent/child/'),
      ]),
    ]

    const result = findCurrentPathDepth(menu, '/parent/child')

    expect(result.links?.label).toBe('Parent')
    expect(result.depth).toBe(2)
  })

  it('handles deeply nested structure with empty paths', () => {
    const menu: SideNavItem[] = [
      createNavItem('Level 1', '', [
        createNavItem('Level 2', '', [
          createNavItem('Level 3', '/level3', [
            createNavItem('Level 4', '/level3/level4'),
          ]),
        ]),
      ]),
    ]

    const result = findCurrentPathDepth(menu, '/level3/level4')

    expect(result.links?.label).toBe('Level 3')
    expect(result.depth).toBe(4)
  })

  it('returns null links when no match found', () => {
    const menu: SideNavItem[] = [
      createNavItem('Parent', '/parent', [
        createNavItem('Child', '/parent/child'),
      ]),
    ]

    const result = findCurrentPathDepth(menu, '/non-existent')

    expect(result.links).toBeNull()
    expect(result.depth).toBe(0)
  })

  it('handles match at first level', () => {
    const menu: SideNavItem[] = [
      createNavItem('First', '/first'),
      createNavItem('Second', '/second'),
    ]

    const result = findCurrentPathDepth(menu, '/first')

    // When the match is at the top level, there's no parent to return
    expect(result.links).toBeNull()
    expect(result.depth).toBe(1)
  })

  it('handles complex life insurance menu structure', () => {
    // Full structure from the user's example
    const menu: SideNavItem[] = [
      createNavItem('Life insurance', '/life-insurance', [
        createNavItem('Get benefits', '', [
          createNavItem(
            'Options and eligibility',
            '/life-insurance/options-eligibility',
            [
              createNavItem(
                "Servicemembers' Group (SGLI)",
                '/life-insurance/options-eligibility/sgli'
              ),
              createNavItem(
                "Family Servicemembers' Group (FSGLI)",
                '/life-insurance/options-eligibility/fsgli'
              ),
              createNavItem(
                'Traumatic Injury Protection (TSGLI)',
                '/life-insurance/options-eligibility/tsgli',
                [
                  createNavItem(
                    'TSGLI loss standards',
                    'https://www.benefits.va.gov/insurance/tsgli_schedule_Schedule.asp'
                  ),
                ]
              ),
              createNavItem(
                "Veterans' Group (VGLI)",
                '/life-insurance/options-eligibility/vgli',
                [
                  createNavItem(
                    'Compare VGLI to other insurance',
                    'https://www.benefits.va.gov/insurance/vgli_rates_compare_vgli.asp'
                  ),
                ]
              ),
            ]
          ),
          createNavItem(
            'Totally disabled or terminally ill policyholders',
            '/life-insurance/totally-disabled-or-terminally-ill'
          ),
        ]),
        createNavItem('Manage benefits', '', [
          createNavItem(
            'Access your policy online',
            '/life-insurance/manage-your-policy'
          ),
          createNavItem(
            'Update beneficiaries',
            'https://www.benefits.va.gov/INSURANCE/updatebene.asp'
          ),
        ]),
      ]),
    ]

    const result = findCurrentPathDepth(
      menu,
      '/life-insurance/options-eligibility/sgli/'
    )

    expect(result.links).not.toBeNull()
    expect(result.links?.label).toBe('Options and eligibility')
    expect(result.links?.url.path).toBe('/life-insurance/options-eligibility')
    expect(result.depth).toBe(4)
  })

  it('returns correct parent for nested item with siblings that have children', () => {
    const menu: SideNavItem[] = [
      createNavItem('Root', '', [
        createNavItem('Branch A', '/branch-a', [
          createNavItem('Leaf A1', '/branch-a/leaf-a1'),
          createNavItem('Leaf A2', '/branch-a/leaf-a2', [
            createNavItem('Deep A2-1', '/branch-a/leaf-a2/deep'),
          ]),
        ]),
        createNavItem('Branch B', '/branch-b', [
          createNavItem('Leaf B1', '/branch-b/leaf-b1'),
        ]),
      ]),
    ]

    const result = findCurrentPathDepth(menu, '/branch-a/leaf-a2/deep')

    expect(result.links?.label).toBe('Leaf A2')
    expect(result.links?.url.path).toBe('/branch-a/leaf-a2')
  })
})
