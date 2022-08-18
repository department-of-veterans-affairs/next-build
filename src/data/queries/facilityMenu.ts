import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '.'
import { Menu } from '@/types/dataTypes/drupal/menu'
import { MenuLink } from '@/types/index'

// Define the query params for fetching a facility menu
export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['title', 'url'])
}

// Define the option types for the data loader
type DataOpts = QueryOpts<{
  id: string
}>

// Implement the data loader
export const data: QueryData<Menu, MenuLink[]> = async () => {
  return [
    { title: 'item 1', url: 'http://foo.com' },
    { title: 'item 2', url: 'http://foo.com' },
  ]
}

// this seems redundant but may be necessary idk
export const formatter: QueryFormatter<Menu, Menu> = (entity: Menu) => {
  return entity
}
