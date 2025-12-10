/**
 * @jest-environment node
 */

import { entityBaseFields } from './entityBaseFields'
import { NodeTypes } from '@/types/drupal/node'
import { LovellStaticPropsContextProps } from './lovell/types'
import { BreadcrumbItem } from '@/types/drupal/field_type'
import { LOVELL } from './lovell/constants'

describe('entityBaseFields', () => {
  const createMinimalEntity = (overrides = {}) => {
    return {
      id: 'test-id',
      title: 'Test Title',
      type: 'node--test',
      status: true,
      drupal_internal__nid: 123,
      path: {
        alias: '/test-path',
      },
      moderation_state: 'published',
      metatag: [],
      changed: '2024-01-01T00:00:00+00:00',
      created: '2023-01-01T00:00:00+00:00',
      ...overrides,
    } as unknown as NodeTypes
  }

  const createBreadcrumbItem = (
    uri: string,
    title: string
  ): BreadcrumbItem => ({
    uri,
    title,
    options: [],
  })

  describe('null/undefined entity handling', () => {
    test('should return null when entity is null', () => {
      const result = entityBaseFields(null as unknown as NodeTypes)
      expect(result).toBeNull()
    })

    test('should return null when entity is undefined', () => {
      const result = entityBaseFields(undefined as unknown as NodeTypes)
      expect(result).toBeNull()
    })
  })

  describe('basic entity without breadcrumbs', () => {
    test('should return PublishedEntity with all base fields', () => {
      const entity = createMinimalEntity()
      const result = entityBaseFields(entity)

      expect(result).toEqual({
        id: 'test-id',
        entityId: 123,
        entityPath: '/test-path',
        type: 'node--test',
        published: true,
        moderationState: 'published',
        title: 'Test Title',
        metatags: [],
        breadcrumbs: null,
        lastUpdated: '2024-01-01T00:00:00+00:00',
      })
    })

    test('should use field_last_saved_by_an_editor for lastUpdated when available', () => {
      const entity = createMinimalEntity({
        field_last_saved_by_an_editor: '2024-02-01T00:00:00+00:00',
        changed: '2024-01-01T00:00:00+00:00',
        created: '2023-01-01T00:00:00+00:00',
      })
      const result = entityBaseFields(entity)

      expect(result?.lastUpdated).toBe('2024-02-01T00:00:00+00:00')
    })

    test('should fallback to changed when field_last_saved_by_an_editor is not available', () => {
      const entity = createMinimalEntity({
        changed: '2024-01-15T00:00:00+00:00',
        created: '2023-01-01T00:00:00+00:00',
      })
      const result = entityBaseFields(entity)

      expect(result?.lastUpdated).toBe('2024-01-15T00:00:00+00:00')
    })

    test('should fallback to created when neither field_last_saved_by_an_editor nor changed are available', () => {
      const entity = createMinimalEntity({
        created: '2023-06-01T00:00:00+00:00',
        changed: undefined,
        field_last_saved_by_an_editor: undefined,
      })
      const result = entityBaseFields(entity)

      expect(result?.lastUpdated).toBe('2023-06-01T00:00:00+00:00')
    })
  })

  describe('entity with breadcrumbs but no path.alias', () => {
    test('should not process breadcrumbs when path.alias is missing', () => {
      const entity = createMinimalEntity({
        breadcrumbs: [
          createBreadcrumbItem('http://va.gov/', 'Home'),
          createBreadcrumbItem('http://va.gov/test-path', 'Test Page'),
        ],
        path: {
          alias: null,
        },
      })
      const result = entityBaseFields(entity)

      expect(result?.breadcrumbs).toBeNull()
    })

    test('should not process breadcrumbs when path.alias is undefined', () => {
      const entity = createMinimalEntity({
        breadcrumbs: [createBreadcrumbItem('http://va.gov/', 'Home')],
        path: {
          alias: undefined,
        },
      })
      const result = entityBaseFields(entity)

      expect(result?.breadcrumbs).toBeNull()
    })
  })

  describe('entity with breadcrumbs and path.alias', () => {
    test('should process breadcrumbs when both breadcrumbs and path.alias exist', () => {
      const entity = createMinimalEntity({
        breadcrumbs: [
          createBreadcrumbItem('http://va.gov/', 'Home'),
          createBreadcrumbItem('http://va.gov/test-path', 'Test Page'),
        ],
      })
      const result = entityBaseFields(entity)

      expect(result?.breadcrumbs).not.toBeNull()
      expect(result?.breadcrumbs).toBeInstanceOf(Array)
      // The breadcrumbs should be formatted, normalized, and have the last one replaced with title
      expect(result?.breadcrumbs?.[result.breadcrumbs.length - 1].label).toBe(
        'Test Title'
      )
    })

    test('should handle empty breadcrumbs array', () => {
      const entity = createMinimalEntity({
        breadcrumbs: [],
      })
      const result = entityBaseFields(entity)

      // Empty breadcrumbs should result in a single breadcrumb with the title
      expect(result?.breadcrumbs).not.toBeNull()
      expect(result?.breadcrumbs?.length).toBe(1)
      expect(result?.breadcrumbs?.[0].label).toBe('Test Title')
      expect(result?.breadcrumbs?.[0].href).toBe('')
    })
  })

  describe('Lovell variant transformation', () => {
    const lovellProps: LovellStaticPropsContextProps = {
      isLovellVariantPage: true,
      variant: LOVELL.va.variant,
    }

    test('should transform title for Lovell variant page', () => {
      const entity = createMinimalEntity({
        title: 'Lovell Federal health care',
      })
      const result = entityBaseFields(entity, lovellProps)

      // getLovellVariantOfTitle should transform the title
      expect(result?.title).toBe('Lovell Federal health care - VA')
    })

    test('should transform breadcrumbs for Lovell variant page', () => {
      const entity = createMinimalEntity({
        title: 'Lovell Federal health care',
        breadcrumbs: [
          createBreadcrumbItem('http://va.gov/', 'Home'),
          createBreadcrumbItem(
            'http://va.gov/lovell-federal-health-care',
            'Lovell Federal health care'
          ),
        ],
      })
      const result = entityBaseFields(entity, lovellProps)

      expect(result?.breadcrumbs).not.toBeNull()
      // The title gets transformed first, then replaces the last breadcrumb,
      // then getLovellVariantOfBreadcrumbs transforms all breadcrumb labels and hrefs
      // So the last breadcrumb should have the transformed title
      expect(result?.breadcrumbs?.[result.breadcrumbs.length - 1].label).toBe(
        'Lovell Federal health care - VA'
      )
    })

    test('should not transform when isLovellVariantPage is false', () => {
      const entity = createMinimalEntity({
        title: 'Lovell Federal health care',
        breadcrumbs: [
          createBreadcrumbItem('http://va.gov/', 'Home'),
          createBreadcrumbItem(
            'http://va.gov/lovell-federal-health-care',
            'Lovell Federal health care'
          ),
        ],
      })
      const lovellPropsFalse: LovellStaticPropsContextProps = {
        isLovellVariantPage: false,
        variant: LOVELL.va.variant,
      }
      const result = entityBaseFields(entity, lovellPropsFalse)

      expect(result?.title).toBe('Lovell Federal health care')
      // Breadcrumbs should still be processed but not transformed
      expect(result?.breadcrumbs).not.toBeNull()
    })

    test('should handle TRICARE variant', () => {
      const entity = createMinimalEntity({
        title: 'Lovell Federal health care',
      })
      const tricareProps: LovellStaticPropsContextProps = {
        isLovellVariantPage: true,
        variant: LOVELL.tricare.variant,
      }
      const result = entityBaseFields(entity, tricareProps)

      expect(result?.title).toBe('Lovell Federal health care - TRICARE')
    })
  })

  describe('edge cases', () => {
    test('should handle entity with minimal required fields', () => {
      const entity = {
        id: 'minimal-id',
        title: 'Minimal Title',
        type: 'node--minimal',
        status: false,
        drupal_internal__nid: 456,
        path: {
          alias: '/minimal',
        },
        moderation_state: 'draft',
        metatag: null,
        created: '2023-01-01T00:00:00+00:00',
      } as unknown as NodeTypes

      const result = entityBaseFields(entity)

      expect(result).toEqual({
        id: 'minimal-id',
        entityId: 456,
        entityPath: '/minimal',
        type: 'node--minimal',
        published: false,
        moderationState: 'draft',
        title: 'Minimal Title',
        metatags: null,
        breadcrumbs: null,
        lastUpdated: '2023-01-01T00:00:00+00:00',
      })
    })

    test('should handle entity without breadcrumbs property', () => {
      const entity = createMinimalEntity()
      delete (entity as { breadcrumbs?: BreadcrumbItem[] }).breadcrumbs

      const result = entityBaseFields(entity)

      expect(result?.breadcrumbs).toBeNull()
    })

    test('should handle entity with null breadcrumbs', () => {
      const entity = createMinimalEntity({
        breadcrumbs: null,
      })
      const result = entityBaseFields(entity)

      expect(result?.breadcrumbs).toBeNull()
    })
  })
})
