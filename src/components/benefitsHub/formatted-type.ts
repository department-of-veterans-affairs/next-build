import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'

export interface BenefitsHub extends PublishedEntity {
  title: string
  titleIcon: string | null
  fieldIntroText: string | null
  fieldSpokes: ListOfLinkTeasers[]
}
