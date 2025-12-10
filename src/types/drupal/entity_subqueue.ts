import { JsonApiResource } from 'next-drupal'
import { BlockBenefitPromo, BlockCtaWithLink } from '@/types/drupal/block'

export interface entitySubqueueHomePageHero extends JsonApiResource {
  items: BlockBenefitPromo[]
}
export interface entityV2HomePageCreateAccount extends JsonApiResource {
  items: BlockCtaWithLink[]
}
