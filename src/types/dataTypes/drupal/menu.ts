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
  field_menu_section?: string
}

type Tree = ReadonlyArray<MenuItem>

// Extra field may exist on megamenu items in the CMS
export interface HeaderMegaMenuItem extends MenuItem {
  field_promo_reference?: {
    id: string
  }
}

export interface HeaderMegaMenu {
  items: HeaderMegaMenuItem[]
  tree: HeaderMegaMenuItem[]
}
