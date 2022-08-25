import { DrupalMenuLinkContent } from 'next-drupal'

export interface Menu {
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
}
