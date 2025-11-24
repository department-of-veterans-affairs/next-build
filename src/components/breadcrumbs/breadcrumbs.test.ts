import {
  formatBreadcrumbs,
  normalizeBreadcrumbs,
  replaceLastBreadcrumbWithTitle,
} from './breadcrumbs'
import { Breadcrumb } from '@/components/breadcrumbs/formatted-types'
import { BreadcrumbItem } from '@/types/drupal/field_type'

describe('formatBreadcrumbs', () => {
  describe('basic functionality', () => {
    it('should format a single breadcrumb correctly', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/home',
          title: 'Home',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result).toEqual([
        {
          href: '/home',
          label: 'Home',
          options: [],
        },
      ])
    })

    it('should format multiple breadcrumbs correctly', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/home',
          title: 'Home',
          options: [],
        },
        {
          uri: 'http://va.gov/about',
          title: 'About',
          options: [],
        },
        {
          uri: 'http://va.gov/about/team',
          title: 'Team',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result).toEqual([
        {
          href: '/home',
          label: 'Home',
          options: [],
        },
        {
          href: '/about',
          label: 'About',
          options: [],
        },
        {
          href: '/about/team',
          label: 'Team',
          options: [],
        },
      ])
    })
  })

  describe('URI path extraction', () => {
    it('should extract pathname from URI with query parameters', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page?param=value',
          title: 'Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].href).toBe('/page')
    })

    it('should extract pathname from URI with hash fragment', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page#section',
          title: 'Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].href).toBe('/page')
    })

    it('should handle root path correctly', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/',
          title: 'Home',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].href).toBe('/')
    })

    it('should handle nested paths correctly', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/level1/level2/level3',
          title: 'Deep Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].href).toBe('/level1/level2/level3')
    })

    it('should handle paths with trailing slashes', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page/',
          title: 'Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].href).toBe('/page/')
    })
  })

  describe('options preservation', () => {
    it('should preserve options array', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page',
          title: 'Page',
          options: [{ key: 'value' }, { another: 'option' }],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].options).toEqual([
        { key: 'value' },
        { another: 'option' },
      ])
    })

    it('should preserve empty options array', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page',
          title: 'Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].options).toEqual([])
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const breadcrumbs: BreadcrumbItem[] = []
      const result = formatBreadcrumbs(breadcrumbs)
      expect(result).toEqual([])
    })

    it('should preserve title exactly as provided', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page',
          title: '  Page with spaces  ',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].label).toBe('  Page with spaces  ')
    })

    it('should handle special characters in paths', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page-with-dashes',
          title: 'Page',
          options: [],
        },
        {
          uri: 'http://va.gov/page_with_underscores',
          title: 'Page',
          options: [],
        },
        {
          uri: 'http://va.gov/page123',
          title: 'Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result[0].href).toBe('/page-with-dashes')
      expect(result[1].href).toBe('/page_with_underscores')
      expect(result[2].href).toBe('/page123')
    })

    it('should not mutate the original array', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page',
          title: 'Page',
          options: [],
        },
      ]

      const originalUri = breadcrumbs[0].uri
      formatBreadcrumbs(breadcrumbs)

      expect(breadcrumbs[0].uri).toBe(originalUri)
    })

    it('should return a new array instance', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        {
          uri: 'http://va.gov/page',
          title: 'Page',
          options: [],
        },
      ]

      const result = formatBreadcrumbs(breadcrumbs)

      expect(result).not.toBe(breadcrumbs)
    })
  })
})

describe('normalizeBreadcrumbs', () => {
  describe('when breadcrumbs match current path', () => {
    it('should set href to empty string for matching breadcrumbs', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '/current-page', label: 'Current Page', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result).toEqual([
        { href: '/home', label: 'Home', options: [] },
        { href: '', label: 'Current Page', options: [] },
      ])
    })

    it('should preserve the last breadcrumb even if it has empty href', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '/current-page', label: 'Current Page', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result.length).toBe(2)
      expect(result[result.length - 1].href).toBe('')
    })

    it('should filter out non-last breadcrumbs with empty href', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/current-page', label: 'First', options: [] },
        { href: '/other', label: 'Other', options: [] },
        { href: '/current-page', label: 'Last', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result).toEqual([
        { href: '/other', label: 'Other', options: [] },
        { href: '', label: 'Last', options: [] },
      ])
    })

    it('should handle path normalization with trailing slashes', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '/current-page/', label: 'Current Page', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result).toEqual([
        { href: '/home', label: 'Home', options: [] },
        { href: '', label: 'Current Page', options: [] },
      ])
    })

    it('should handle path normalization without leading slash', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '/current-page', label: 'Current Page', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, 'current-page')

      expect(result).toEqual([
        { href: '/home', label: 'Home', options: [] },
        { href: '', label: 'Current Page', options: [] },
      ])
    })

    it('should preserve root path normalization', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/', label: 'Home', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/')

      expect(result).toEqual([{ href: '', label: 'Home', options: [] }])
    })
  })

  describe('when breadcrumbs do not match current path', () => {
    it('should leave breadcrumbs unchanged', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '/other-page', label: 'Other Page', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result).toEqual(breadcrumbs)
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const breadcrumbs: Breadcrumb[] = []
      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')
      expect(result).toEqual([])
    })

    it('should handle single breadcrumb that matches', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/current-page', label: 'Current Page', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result).toEqual([{ href: '', label: 'Current Page', options: [] }])
    })

    it('should handle multiple breadcrumbs matching current path', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/current-page', label: 'First Match', options: [] },
        { href: '/other', label: 'Other', options: [] },
        { href: '/current-page', label: 'Second Match', options: [] },
        { href: '/another', label: 'Another', options: [] },
        { href: '/current-page', label: 'Last Match', options: [] },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      // Should filter out all empty hrefs except the last one
      expect(result).toEqual([
        { href: '/other', label: 'Other', options: [] },
        { href: '/another', label: 'Another', options: [] },
        { href: '', label: 'Last Match', options: [] },
      ])
    })

    it('should preserve options when normalizing', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          href: '/current-page',
          label: 'Current Page',
          options: [{ key: 'value' }],
        },
      ]

      const result = normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(result).toEqual([
        {
          href: '',
          label: 'Current Page',
          options: [{ key: 'value' }],
        },
      ])
    })

    it('should not mutate the original array', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/current-page', label: 'Current Page', options: [] },
      ]

      const originalHref = breadcrumbs[0].href
      normalizeBreadcrumbs(breadcrumbs, '/current-page')

      expect(breadcrumbs[0].href).toBe(originalHref)
    })
  })
})

describe('replaceLastBreadcrumbWithTitle', () => {
  describe('when breadcrumbs array is empty', () => {
    it('should add a new breadcrumb with empty href and the title', () => {
      const breadcrumbs: Breadcrumb[] = []
      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'Page Title')

      expect(result).toEqual([
        {
          href: '',
          label: 'Page Title',
          options: [],
        },
      ])
    })
  })

  describe('when last breadcrumb has empty href', () => {
    it('should replace the last breadcrumb label with the new title', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '', label: 'Old Title', options: [] },
      ]

      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'New Title')

      expect(result).toEqual([
        { href: '/home', label: 'Home', options: [] },
        { href: '', label: 'New Title', options: [] },
      ])
    })

    it('should preserve other properties of the last breadcrumb', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        {
          href: '',
          label: 'Old Title',
          options: [{ key: 'value' }],
        },
      ]

      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'New Title')

      expect(result).toEqual([
        { href: '/home', label: 'Home', options: [] },
        {
          href: '',
          label: 'New Title',
          options: [{ key: 'value' }],
        },
      ])
    })
  })

  describe('when last breadcrumb does not have empty href', () => {
    it('should append a new breadcrumb with empty href', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '/previous-page', label: 'Previous Page', options: [] },
      ]

      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'Current Page')

      expect(result).toEqual([
        { href: '/home', label: 'Home', options: [] },
        { href: '/previous-page', label: 'Previous Page', options: [] },
        { href: '', label: 'Current Page', options: [] },
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle single breadcrumb with empty href', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '', label: 'Old Title', options: [] },
      ]

      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'New Title')

      expect(result).toEqual([{ href: '', label: 'New Title', options: [] }])
    })

    it('should handle single breadcrumb without empty href', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/other-page', label: 'Other Page', options: [] },
      ]

      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'Current Page')

      expect(result).toEqual([
        { href: '/other-page', label: 'Other Page', options: [] },
        { href: '', label: 'Current Page', options: [] },
      ])
    })

    it('should not mutate the original array', () => {
      const breadcrumbs: Breadcrumb[] = [
        { href: '/home', label: 'Home', options: [] },
        { href: '', label: 'Old Title', options: [] },
      ]

      const originalLength = breadcrumbs.length
      const result = replaceLastBreadcrumbWithTitle(breadcrumbs, 'New Title')

      expect(breadcrumbs.length).toBe(originalLength)
      expect(breadcrumbs[1].label).toBe('Old Title')
      expect(result).not.toBe(breadcrumbs)
    })
  })
})
