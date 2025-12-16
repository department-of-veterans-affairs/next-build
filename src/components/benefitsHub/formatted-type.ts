import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { SupportService } from '@/components/supportServices/formatted-type'
import { NodeOffice } from '@/types/drupal/node'
import { AlertBlock } from '@/components/alert/formatted-type'
import { BlockPromo } from '@/types/drupal/block'
import { MegaMenuPromoColumn } from '@/components/header/formatted-type'

export interface BenefitsHub extends PublishedEntity {
  title: string
  titleIcon: string | null
  spokes: ListOfLinkTeasers[] | null
  intro: string | null
  fieldLinks: Array<{
    title: string
    url: {
      path: string
    }
  }> | null
  supportServices?: SupportService[]
  connectWithUs: Pick<
    NodeOffice,
    'field_email_updates_link' | 'field_social_media_links'
  > | null
  relatedLinks: ListOfLinkTeasers | null
  alert: AlertBlock | null
  promo: BlockPromo | MegaMenuPromoColumn | null
}
