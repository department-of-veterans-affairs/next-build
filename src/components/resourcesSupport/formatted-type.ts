import { FormattedParagraph } from '@/lib/drupal/queries'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AlertSingle } from '@/components/alert/formatted-type'
import { ContactInformation } from '@/components/contactInformation/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { BrowseByTopicData } from '@/components/browseByTopic/formatted-type'
import { BenefitsHubLink } from '@/components/benefitsHubLinks/formatted-type'

export type ResourcesSupport = PublishedEntity & {
  title: string
  intro: string
  alert: AlertSingle
  buttons: Button[]
  repeatButtons: boolean
  toc: boolean
  mainContent: FormattedParagraph[]
  browseByTopic: BrowseByTopicData | null
  contactInformation: ContactInformation
  benefitsHubLinks: BenefitsHubLink[]
}
