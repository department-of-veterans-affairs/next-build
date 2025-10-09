import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { ParagraphListOfLinkTeasers } from '@/types/drupal/paragraph'

export interface BenefitsHub extends PublishedEntity {
  title: string
  titleIcon: string | null
  fieldIntroText: string | null
  fieldSpokes: ParagraphListOfLinkTeasers[]
}
