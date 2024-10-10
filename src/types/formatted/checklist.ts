import { PublishedEntity } from './publishedEntity'
import { AlertSingle } from '@/types/formatted/alert'
import { Button } from '@/types/formatted/button'
import { ChecklistItem } from '@/types/formatted/checklistItem'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { TaxonomyTermLcCategories } from '@/types/formatted/taxonomy_term'

export type Checklist = PublishedEntity & {
  alert: AlertSingle
  buttons: Button[]
  checklist: ChecklistItem[]
  contactInformation: ContactInfo
  intro: string
  otherCategories: TaxonomyTermLcCategories[]
  primaryCategory: TaxonomyTermLcCategories
  repeatButtons: boolean
}
