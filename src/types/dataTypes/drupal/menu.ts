import { DrupalMenuLinkContent } from 'next-drupal'

export interface Menu {
  items: DrupalMenuLinkContent[]
  tree: DrupalMenuLinkContent[]
}

export interface MenuItem {
  readonly id: string
  readonly url: string
  readonly title: string
  description?: string
  expanded: boolean
  enabled: boolean
  items?: Tree
}

type Tree = ReadonlyArray<MenuItem>
