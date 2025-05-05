import { BreadcrumbItem } from '../drupal/field_type'
import { MetaTag } from './metatags'

export interface PublishedEntity {
  id: string
  type: string
  published: boolean
  title: string
  entityId?: number
  entityPath?: string
  moderationState?: string
  breadcrumbs?: BreadcrumbItem[]
  metatags?: MetaTag[]
  /**
   * Datetime string with timezone.
   * @example '2025-02-27T17:26:37+00:00'
   */
  lastUpdated: string
}

export interface PublishedParagraph {
  id: string
  type: string
  entityId?: number
}
