import { PublishedEntity } from '@/types/formatted/publishedEntity'

export interface BenefitsHub extends PublishedEntity {
  title: string
  intro?: string
  hubLabel?: string
  teaserText?: string
  titleIcon?: string
}
