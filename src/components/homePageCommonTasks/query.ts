import { QueryData, QueryFormatter } from 'next-drupal-query'
import { Menu, MenuItem } from '@/types/drupal/menu'
import { CommonTasksData, Link } from './formatted-type'
import { getMenu } from '@/lib/drupal/query'

export type RawData = {
  popularLinks: Menu
  searchLinks: Menu
}

export const data: QueryData<null, RawData> = async () => {
  const [popularLinks, searchLinks] = await Promise.all([
    getMenu('popular-on-va-gov'),
    getMenu('other-search-tools'),
  ])

  return { popularLinks, searchLinks }
}

function formatLink(link: MenuItem): Link {
  return {
    url: link.url,
    title: link.title,
  }
}

function menuToLinks(menu: Menu): Link[] {
  return menu.items.map(formatLink)
}

export const formatter: QueryFormatter<RawData, CommonTasksData> = ({
  popularLinks,
  searchLinks,
}) => {
  return {
    popularLinks: menuToLinks(popularLinks),
    searchLinks: menuToLinks(searchLinks),
  }
}
