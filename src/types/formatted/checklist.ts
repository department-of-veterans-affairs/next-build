import { PublishedEntity } from './publishedEntity'
import { AlertSingle } from '@/types/formatted/alert'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { Button } from '@/types/formatted/button'
import { ChecklistItem } from '@/types/formatted/checklistItem'
import { ContactInfo } from '@/types/formatted/contactInfo'

export type Checklist = PublishedEntity & {
  alert: AlertSingle
  buttons: Button[]
  checklist: ChecklistItem[]
  contactInformation: ContactInfo
  intro: string
  repeatButtons: boolean
  tags: AudienceTopics
}
