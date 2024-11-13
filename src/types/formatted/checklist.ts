import { PublishedEntity } from './publishedEntity'
import { AlertSingle } from '@/types/formatted/alert'
import { Button } from '@/types/formatted/button'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { TaxonomyTermLcCategories } from '@/types/formatted/taxonomy_term'

type ChecklistItem {
  items: string[]
  header: string
  intro: string
}

export type Checklist = PublishedEntity & {
  alert: AlertSingle
  buttons: Button[]
  contactInformation: ContactInfo
  intro: string
  otherCategories: TaxonomyTermLcCategories[]
  primaryCategory: TaxonomyTermLcCategories
  repeatButtons: boolean
  sections: ChecklistItem[]
}
