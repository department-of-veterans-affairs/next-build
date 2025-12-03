import { FieldLink } from '@/types/drupal/field_type'

export interface SupportService {
  type: string
  id: string
  title: string
  number?: string
  link?: FieldLink
}
