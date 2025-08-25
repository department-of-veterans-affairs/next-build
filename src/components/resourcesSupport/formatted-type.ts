import { FormattedParagraph } from '@/data/queries'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AlertSingle } from '@/components/alert/formatted-type'
import { ContactInfo } from '@/components/contactInfo/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { AudienceTopics } from '@/components/audienceTopics/formatted-type'
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
