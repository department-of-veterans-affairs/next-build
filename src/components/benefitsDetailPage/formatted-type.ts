import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/formatted-type'
import { Administration } from '../administration/formatted-type'
// import { FormattedParagraph } from '@/lib/drupal/queries'
import { AlertBlock } from '../alert/formatted-type'

export interface BenefitsDetailPage extends PublishedEntity {
  title: string
  description: string | null
  introText: string | null
  showTableOfContents: boolean
  alert: AlertBlock | null
  // featuredContent: FormattedParagraph[] | null
  // contentBlock: FormattedParagraph[] | null
  relatedLinks: ListOfLinkTeasers | null
  administration: Administration | null
}
