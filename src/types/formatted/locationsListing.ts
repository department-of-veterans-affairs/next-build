import { BreadcrumbItem } from '@/types/drupal/field_type'
import { MetaTag } from './metatags'

export type LocationsListing = {
  id: string
  type: 'node--locations_listing'
  title: string
  entityId: number
  entityPath: string
  breadcrumbs: BreadcrumbItem[]
  metatags: MetaTag[]
  lastUpdated: string
}
