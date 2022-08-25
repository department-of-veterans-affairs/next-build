import { Menu } from '@/types/dataTypes/drupal/menu'

export interface PublishedEntity {
  id: string
  type: string
  published: boolean
}

export type Path = {
  pid?: number
  alias?: string
  langcode?: string
}

export type BannerType = {
  id: string
  title: string
  body?: string
  alertType?: string
  dismiss?: boolean
  type?: string
}

export type PromoBannerType = {
  id: string
  title?: string
  href?: string
  alertType?: string
  dismiss?: boolean
  type?: string
}

export type BannerAlertVacms = {
  id: string
  path?: { alias?: string }
  field_office?: { path: Path }
}

export type FacilityBannerType = {
  id: string
  title: string
  body?: string
  fieldAlertType?: string
  dismiss?: boolean
  path?: Path
  type?: string
  operatingStatus?: boolean
  findFacilities?: string
  inheritanceSubpages?: boolean
  bannerAlertVacms?: BannerAlertVacms[]
}

export type MediaImageType = {
  id: string
  alt?: string
  title?: string
  className?: string | ''
  link: string
  imageStyle: string
  loader?: () => void
}

export type NewsStoryType = PublishedEntity & {
  title: string
  image: ImageProps
  caption: string
  author: PersonProfileTeaserProps
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
}

export type NewsStoryTeaserType = PublishedEntity & {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  title: string
  image: ImageProps
  introText: string
}

export type StoryListingType = PublishedEntity & {
  title: string
  introText: string
  stories: NewsStoryTeaserType[]
  menu: Menu
}

export type StoryListingLinkType = {
  path: string
}

export type ExpandableTextType = {
  id: string
  header: string
  text: string
}

export type LinkTeaserType = {
  id: string
  title: string
  summary: string
  uri: string
  parentField: string
  options: any[]
  componentParams: {
    boldTitle: boolean
    sectionHeader: string
  }
}

interface MenuItemProps {
  readonly id: string
  readonly url: string
  readonly title: string
  expanded: boolean
  enabled: boolean
  items?: Tree
  depth?: number
  children?: any
}

type Tree = ReadonlyArray<MenuItemProps>
