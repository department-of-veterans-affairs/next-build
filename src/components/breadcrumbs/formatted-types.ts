import { BreadcrumbItem } from '@/types/drupal/field_type'

export interface Breadcrumb {
  href: string
  label: string
  options?: BreadcrumbItem['options']
}
