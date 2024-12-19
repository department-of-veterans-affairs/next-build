export type FooterLink = {
  column: number | string // either # or 'bottom_rail'
  href: string
  order: number
  target?: string
  title: string
}

// type expected by window.VetsGov.headerFooter
export type HeaderFooterData = {
  footerData?: FooterLink[]
  megaMenuData?: MegaMenuSection[]
}

export type MegaMenuColumn = {
  title: string
  links: MegaMenuLinkObject | MegaMenuLink[]
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

export type MegaMenuPromoColumn = {
  img: {
    src: string
    alt: string
  }
  link: MegaMenuLink
  description: string
}

export type MegaMenuSection = {
  title: string
  href?: string
  menuSections?:
    | (MegaMenuColumn | MegaMenuPromoColumn | MegaMenuLink)[]
    | MegaMenuLinkObject
}
