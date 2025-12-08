import { QueryData, QueryFormatter } from 'next-drupal-query'
import { HomePageHubListMenu } from '@/types/drupal/menu'
import { BenefitsData } from './formatted-type'
import { getMenu } from '@/lib/drupal/query'

export const data: QueryData<null, HomePageHubListMenu> = async () => {
  return (await getMenu('home-page-hub-list')) as unknown as HomePageHubListMenu
}

export const formatter: QueryFormatter<HomePageHubListMenu, BenefitsData> = ({
  items,
}) => {
  return {
    benefitsHubLinks: items.map((item) => ({
      url: item.url,
      title: item.title,
      description: item.field_link_summary,
      icon: item.field_icon,
    })),
  }
}
