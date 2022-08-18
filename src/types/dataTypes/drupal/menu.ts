import { DrupalMenuLinkContent } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export interface Menu {
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
}

export interface MenuMetaInfo {
  resource: string
  component: ({ items, ...props }: Menu) => JSX.Element
  params?: DrupalJsonApiParams
}

export interface MenuMetaOut {
  [resource: string]: {
    component: ({ items }: Menu) => JSX.Element
    params?: DrupalJsonApiParams
  }
}
