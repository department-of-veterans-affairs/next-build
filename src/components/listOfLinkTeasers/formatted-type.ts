import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'

export type ListOfLinkTeasers = PublishedParagraph & {
  type: 'paragraph--list_of_link_teasers'
  title: string
  linkTeasers: FormattedLinkTeaser[]
  parentField?: string | null
  isHubPage: boolean | false
}
