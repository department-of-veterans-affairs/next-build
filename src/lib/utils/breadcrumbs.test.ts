import {
  deriveLastBreadcrumbFromPath,
  deriveRcBreadcrumbs,
  transformBreadcrumbs,
  filterInvalidCrumbs,
  shouldHideHomeBreadcrumb,
} from './breadcrumbs'
import { BreadcrumbItem } from '@/types/drupal/field_type'

describe('breadcrumbUtils', () => {
  describe('deriveLastBreadcrumbFromPath', () => {
    it('should add a breadcrumb at the end when replaceLastItem is false', () => {
      const input: BreadcrumbItem[] = [
        { uri: '/test1', title: 'Test1', options: [] },
      ]
      const result = deriveLastBreadcrumbFromPath(
        input,
        'Test2',
        '/test2',
        false
      )
      expect(result).toEqual([
        { uri: '/test1', title: 'Test1', options: [] },
        { uri: '/test2', title: 'Test2', options: [] },
      ])
    })

    it('should replace the last breadcrumb when replaceLastItem is true', () => {
      const input: BreadcrumbItem[] = [
        { uri: '/test1', title: 'Test1', options: [] },
        { uri: '/test2', title: 'Test2', options: [] },
      ]
      const result = deriveLastBreadcrumbFromPath(
        input,
        'Test3',
        '/test3',
        true
      )
      expect(result).toEqual([
        { uri: '/test1', title: 'Test1', options: [] },
        { uri: '/test3', title: 'Test3', options: [] },
      ])
    })
  })

  describe('deriveRcBreadcrumbs', () => {
    it('should add "Resources and support" breadcrumb and exclude "/resources" breadcrumb', () => {
      const input: BreadcrumbItem[] = [
        { uri: '/test1', title: 'Test1', options: [] },
        { uri: '/resources', title: 'Resources', options: [] },
      ]
      const result = deriveRcBreadcrumbs(input, 'Test2', '/test2')
      expect(result).toEqual([
        { uri: '/test1', title: 'Test1', options: [] },
        { uri: '/test2', title: 'Resources and support', options: [] },
      ])
    })

    it('should include the title when rcBreadcrumbsTitleInclude is true', () => {
      const input: BreadcrumbItem[] = [
        { uri: '/test1', title: 'Test1', options: [] },
      ]
      const result = deriveRcBreadcrumbs(input, 'Test2', '/test2', true)
      expect(result).toEqual([
        { uri: '/test1', title: 'Test1', options: [] },
        { uri: '/test2', title: 'Resources and support', options: [] },
        { uri: '/test2', title: 'Test2', options: [] },
      ])
    })
  })

  describe('transformBreadcrumbs', () => {
    it('should transform BreadcrumbItem array to the expected format', () => {
      const input: BreadcrumbItem[] = [
        { uri: '/test1', title: 'Test1', options: ['option1'] },
        { uri: '/test2', title: 'Test2', options: ['option2'] },
      ]
      const result = transformBreadcrumbs(input)
      expect(result).toEqual([
        { href: '/test1', label: 'Test1', options: ['option1'] },
        { href: '/test2', label: 'Test2', options: ['option2'] },
      ])
    })
  })

  describe('filterInvalidCrumbs', () => {
    it("should exclude crumbs with an empty href unless it's the last crumb", () => {
      const input = [
        { href: '/test1', label: 'Test1' },
        { href: '', label: 'Empty1' },
        { href: '/test2', label: 'Test2' },
        { href: '', label: 'Empty2' },
      ]

      const result = filterInvalidCrumbs(input)
      expect(result).toEqual([
        { href: '/test1', label: 'Test1' },
        { href: '/test2', label: 'Test2' },
        { href: '', label: 'Empty2' },
      ])
    })
  })

  describe('shouldHideHomeBreadcrumb', () => {
    it('should return false for RESOURCE_TYPES.EVENT', () => {
      const resourceType = 'node--event'
      const result = shouldHideHomeBreadcrumb(resourceType)
      expect(result).toBe(false)
    })

    it('should return true for non-event resource types', () => {
      const resourceType = 'node--other-type'
      const result = shouldHideHomeBreadcrumb(resourceType)
      expect(result).toBe(true)
    })
  })
})
