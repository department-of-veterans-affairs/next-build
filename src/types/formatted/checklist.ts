import { PublishedEntity } from './publishedEntity'
import { AlertSingle } from '@/types/formatted/alert'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { BenefitsHubLink } from '@/types/formatted/benefitsHub'
import { Button } from '@/types/formatted/button'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { LinkTeaser } from '@/types/formatted/linkTeaser'

export type ChecklistItem = {
  items: string[]
  header: string
  intro: string
}

export type Checklist = PublishedEntity & {
  alert: AlertSingle
  benefitHubsLinks: BenefitsHubLink[]
  buttons: Button[]
  checklist: ChecklistItem[]
  contactInformation: ContactInfo
  intro: string
  relatedInformation: LinkTeaser[]
  repeatButtons: boolean
  tags: AudienceTopics
}
