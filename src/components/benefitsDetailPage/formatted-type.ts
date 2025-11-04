import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { Administration } from '@/components/administration/formatted-type'
import { FormattedParagraph } from '@/lib/drupal/queries'
import { AlertBlock } from '@/components/alert/formatted-type'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { SideNavMenuIcon } from '@/components/sideNav/formatted-type'

export interface BenefitsDetailPage extends PublishedEntity {
  title: string
  description: string | null
  introText: string | null
  showTableOfContents: boolean
  alert: AlertBlock | null
  featuredContent: FormattedParagraph[] | null
  mainContent: FormattedParagraph[]
  relatedLinks: ListOfLinkTeasers | null
  administration: Administration | null
  menu: SideNavMenu | null
  menuIcon: SideNavMenuIcon | null
}
