import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AudienceTopics } from '@/components/audienceTopics/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { AlertSingle } from '@/components/alert/formatted-type'
import { ContactInformation } from '@/components/contactInformation/formatted-type'
import { BenefitsHubLink } from '@/components/benefitsHubLinks/formatted-type'

export type QuestionAnswer = PublishedEntity & {
  answers: string
  buttons: Button[] | null
  teasers: LinkTeaser[] | null
  tags: AudienceTopics | null
  alert: AlertSingle | null
  contactInformation: ContactInformation | null
  benefitsHubLinks: BenefitsHubLink[] | null
}
