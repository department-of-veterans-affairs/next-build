import {
  normalizeBreadcrumbs,
  replaceLastBreadcrumbWithTitle,
} from './breadcrumbs'
import { Breadcrumb } from '@/components/breadcrumbs/formatted-types'

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
