import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getResourceByPath } from '@/lib/drupal/query'
import { drupalClient } from '@/lib/drupal/drupalClient'


// export type frontPageHero = {
//   frontPageData: 
// }

export const heroParams: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['items'])
}
// export const data: QueryData<null, any> = async () => {
//   const frontPageHero = await getResourceByPath('/jsonapi/entity_subqueue/home_page_hero', heroParams)

//   return {
//     frontPageHero,
//   }
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const data: QueryData<null, any> = async () => {
  const bannerUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/entity_subqueue/home_page_hero?include=items`

  const response = await drupalClient.fetch(bannerUrl)
  const json = await response.json()
  return json.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatter: QueryFormatter<any, any> = (
  frontPageHero,
) => {
  console.log(frontPageHero)
  return frontPageHero
}
