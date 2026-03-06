import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AudienceTopics } from '@/components/audienceTopics/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { AlertSingle } from '@/components/alert/formatted-type'
import { ContactInfo } from '@/components/contactInfo/formatted-type'
import { BenefitsHubLink } from '@/components/benefitsHubLinks/formatted-type'

export type QuestionAnswer = PublishedEntity & {
  title: string
  answers: string
  buttons: Button[]
  teasers: LinkTeaser[]
  tags?: AudienceTopics
  alert?: AlertSingle
  contactInformation?: ContactInfo
  benefitsHubLinks?: BenefitsHubLink[]
  className?: string
  entityId: number
  entityPath: string
}
