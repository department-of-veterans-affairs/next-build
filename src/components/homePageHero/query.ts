import { QueryData, QueryFormatter } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { HomePageHeroData } from './formatted-type'
import { deserialize, JsonApiResponse } from 'next-drupal'
import { FieldLink } from '@/types/drupal/field_type'

export type RawData = {
  promoBlock: JsonApiResponse
  createAccountBlock: JsonApiResponse
}

export const data: QueryData<null, RawData> = async () => {
  const promoBlockQueueURL = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/entity_subqueue/home_page_hero?include=items,items.field_promo_cta`
  const createAccountBlockQueueURL = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/entity_subqueue/v2_home_page_create_account?include=items`
  const promoBlockResponse = await drupalClient.fetch(promoBlockQueueURL)
  const promoBlockJson = await promoBlockResponse.json()
  const createAccountBlockResponse = await drupalClient.fetch(
    createAccountBlockQueueURL
  )
  const createAccountBlockJson = await createAccountBlockResponse.json()
  return {
    promoBlock: promoBlockJson,
    createAccountBlock: createAccountBlockJson,
  }
}

export const formatter: QueryFormatter<RawData, HomePageHeroData> = (
  frontPageHero
) => {
  // Since we are using fetch we need to manually deserialize the JSON
  const deserializedPromoBlockData = deserialize(frontPageHero.promoBlock)
  const deserializedCreateAccountBlockData = deserialize(
    frontPageHero.createAccountBlock
  )
  // This should only have one thing and if there are more we should use the first
  const firstPromoBlock = deserializedPromoBlockData[0].items[0]
  const firstCreateAccountBlock = deserializedCreateAccountBlockData[0].items[0]
  return {
    promoHeadline: firstPromoBlock.field_promo_headline,
    promoCta: {
      title: firstPromoBlock.field_promo_cta.field_button_label,
      url: firstPromoBlock.field_promo_cta.field_button_link.url,
    },
    promoText: firstPromoBlock.field_promo_text,
    ctaSummaryText: firstCreateAccountBlock.field_cta_summary_text,
    primaryCtaButtonText: firstCreateAccountBlock.field_primary_cta_button_text,
    relatedInfoLinks: firstCreateAccountBlock.field_related_info_links.map(
      (relatedLink: FieldLink) => {
        return {
          title: relatedLink.title,
          url: relatedLink.url,
        }
      }
    ),
  }
}
