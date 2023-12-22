export type FooterLink = {
  column: number | string // either # or 'bottom_rail'
  href: string
  order: number
  target?: string
  title: string
}

export type MegaMenuLink = {
  text: string
  href: string
}

export type MegaMenuLinkObject = {
  mainColumn?: MegaMenuColumn
  columnOne?: MegaMenuColumn
  columnTwo?: MegaMenuColumn
  columnThree?: MegaMenuPromoColumn
  columnFour?: MegaMenuColumn
  seeAllLink?: MegaMenuLink
}

export type MegaMenuSection = {
  title: string
  href?: string
  menuSections?:
    | (MegaMenuColumn | MegaMenuPromoColumn | MegaMenuLink)[]
    | MegaMenuLinkObject
}

export type MegaMenuColumn = {
  title: string
  links: MegaMenuLinkObject | MegaMenuLink[]
}

export type MegaMenuPromoColumn = {
  img: {
    src: string
    alt: string
  }
  link: MegaMenuLink
  description: string
}

// type expected by window.VetsGov.headerFooter
export type HeaderFooterData = {
  footerData?: FooterLink[]
  megaMenuData?: MegaMenuSection[]
}
