import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'

export interface BenefitsHub extends PublishedEntity {
  title: string
  titleIcon: string | null
  spokes: ListOfLinkTeasers[]
  intro: string | null
  fieldLinks: Array<{
    title: string
    url: {
      path: string
    }
  }> | null
  fieldSupportServices?: Array<{
    type: string
    id: string
    title: string
    field_phone_number?: string
    field_link?: {
      uri: string
      title: string
      url?: string
    }
  }>
}
