import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { queries } from '.'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { BlockPromo } from '@/types/drupal/block'
import { MegaMenuPromoColumn } from '@/types/formatted/headerFooter'

// Define the query params for fetching block_content--promo.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude(['field_image', 'field_image.image', 'field_promo_link'])
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader.
export const data: QueryData<DataOpts, BlockPromo> = async (opts) => {
  const entity = await drupalClient.getResource<BlockPromo>(
    'block_content--promo',
    opts?.id,
    {
      params: params().getQueryObject(),
    }
  )

  return entity
}

export const formatter: QueryFormatter<BlockPromo, MegaMenuPromoColumn> = (
  entity: BlockPromo
) => {
  return {
    img: {
      src: entity.field_image.image.links['3_2_medium_thumbnail'].href,
      alt: entity.field_image.image.resourceIdObjMeta.alt,
    },
    link: {
      text: entity.field_promo_link.field_link.title,
      href: entity.field_promo_link.field_link.uri,
    },
    description: entity.field_promo_link.field_link_summary,
    id: entity.drupal_internal__id,
  }
}
