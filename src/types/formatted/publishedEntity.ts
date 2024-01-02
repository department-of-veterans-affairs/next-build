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
  lastUpdated: string
}
