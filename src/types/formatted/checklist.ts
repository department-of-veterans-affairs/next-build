import { PublishedEntity } from './publishedEntity'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { AlertSingle } from '@/types/formatted/alert'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { BenefitsHubLink } from '@/types/formatted/benefitsHub'
import { Button } from '@/types/formatted/button'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { LinkTeaser } from '@/types/formatted/linkTeaser'

export type ChecklistItem = PublishedParagraph & {
  type: 'paragraph--checklist_item'
  items: string[]
  header: string
  intro: string
}

export type Checklist = PublishedEntity & {
  alert: AlertSingle
  benefitsHubLinks: BenefitsHubLink[]
  buttons: Button[]
  checklist: ChecklistItem[]
  contactInformation: ContactInfo
  intro: string
  relatedInformation: LinkTeaser[]
  repeatButtons: boolean
  tags: AudienceTopics
}
