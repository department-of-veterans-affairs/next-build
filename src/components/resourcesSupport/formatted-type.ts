import { FormattedParagraph } from '@/data/queries'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AlertSingle } from '@/types/formatted/alert'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { Button } from '@/types/formatted/button'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { BenefitsHubLink } from '@/components/benefitsHubLinks/formatted-type'

export type ResourcesSupport = PublishedEntity & {
  title: string
  intro: string
  alert: AlertSingle
  buttons: Button[]
  repeatButtons: boolean
  toc: boolean
  mainContent: FormattedParagraph[]
  tags: AudienceTopics
  contactInformation: ContactInfo
  benefitsHubLinks: BenefitsHubLink[]
}
