import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NewsSpotlightData } from './formatted-type'
import { deserialize, JsonApiResponse } from 'next-drupal'
import { formatter as formatImage } from '@/components/mediaImage/query'
import { getNestedIncludes } from '@/lib/utils/queries'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'items',
    ...getNestedIncludes('items.field_image', 'media--image'),
  ])
}

export const data: QueryData<null, JsonApiResponse> = async () => {
  const includes = params().getQueryObject().include
  const promoBlockQueueURL = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/entity_subqueue/home_page_news_spotlight?include=${includes}`
  const promoBlockResponse = await drupalClient.fetch(promoBlockQueueURL)
  const promoBlockJson = await promoBlockResponse.json()
  return promoBlockJson
}

export const formatter: QueryFormatter<JsonApiResponse, NewsSpotlightData> = (
  jsonData
) => {
  // Since we are using fetch we need to manually deserialize the JSON
  const deserializedPromoBlockData = deserialize(jsonData)
  // This should only have one thing and if there are more we should use the first
  const promoBlock = deserializedPromoBlockData[0].items[0]

  const image = formatImage(promoBlock.field_image)
  if (!image) {
    throw new Error('Missing promo image')
  }

  return {
    image,
    headline: promoBlock.field_promo_headline,
    link: promoBlock.field_link,
    promoText: promoBlock.field_promo_text,
  }
}
