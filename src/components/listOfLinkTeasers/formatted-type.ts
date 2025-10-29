import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { LinkTeaser } from '@/components/linkTeaser/formatted-type'

export type ListOfLinkTeasers = PublishedParagraph & {
  type: 'paragraph--list_of_link_teasers'
  title: string
  linkTeasers: LinkTeaser[]
  isHubPage?: boolean | false
}
