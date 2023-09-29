import { Menu } from '@/types/dataTypes/drupal/menu'
import {
  NodeOffice,
  NodeHealthCareRegionPage,
} from '@/types/dataTypes/drupal/node'
import { PathAlias } from 'next-drupal'
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

export type MediaImageLink = {
  href: string
  meta: { linkParams: { width: number; height: number } }
}

export type MediaImageType = {
  id: string
  alt: string
  title: string
  url: string
  width: number
  height: number
  link: MediaImageLink
  imageStyle?: string
  className?: string
  style?: string
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
  entityId: number
  entityPath: string
}

export type NewsStoryTeaserType = PublishedEntity & {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  title: string
  image: ImageProps
  introText: string
}

export type PersonProfileType = {
  id: string
  type: string
  entityId: number
  entityPath: string
  path: Path
  title?: string
  firstName: string
  lastName: string
  suffix?: string
  emailAddress?: string
  phoneNumber?: string
  description?: string
  introText: string
  body: string
  media?: MediaImageType
  completeBiography?: { url: string }
  completeBiographyCreate?: boolean
  photoAllowHiresDownload?: boolean
  vamcOfficalName: string
  office: NodeOffice | NodeHealthCareRegionPage
}

export type StaffProfileType = {
  id: string
  name: string
  thumbnail?: ImageProps
  linkToBio?: boolean
  path?: string | null
  description?: string
  phone?: string
  email?: string
}

export type StoryListingType = PublishedEntity & {
  title: string
  introText: string
  stories: NewsStoryTeaserType[]
  menu: SideNavMenu
  currentPage: number
  totalPages: number
  entityId: number
  entityPath: string
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
  componentParams: {
    boldTitle: boolean
    sectionHeader: string
  }
}

export type ContentFooterType = {
  lastUpdated?: string | number
}

export type StaticPathResourceType = {
  path: PathAlias
  administration: {
    id: number
    name: string
  }
}

export type SideNavItem = {
  description: string
  expanded: boolean
  label: string
  links: SideNavItem[]
  url: { path: string }
}

export type SideNavData = {
  name: string
  description: string
  links: SideNavItem[]
}

export type SideNavMenu = {
  rootPath: string
  data: SideNavData
}

interface ButtonType {
  id: string
  label: string
  url: string
}

interface AlertType {
  alertType: string
  id: string
  title: string
  content: {
    header?: string
    text: string
  }
}

interface EmailContactType {
  id: string
  label: string
  address: string
}

interface WysiwygType {
  id: string
  html: string
  className?: string
}

interface HtmlType {
  __html: string
}

export type QuestionAnswerType = PublishedEntity & {
  title: string
  answers: string
  buttons: ButtonType[]
  tags: AudienceTopicType[]
  teasers: LinkTeaserType[]
  className?: string
  entityId: number
  entityPath: string
}

interface BenefitsHubLinksType {
  title: string
  relatedBenefitHubs: BenefitsHubType[]
}

interface BenefitsHubType {
  id: string
  url: string
  title: string
  homePageHubLabel: string
  teaserText: string
}

/**
 * This is the structure of an individual tag in AudienceTopics.
 */
interface AudienceTopicType {
  id: string
  href: string
  name: string
  categoryLabel: string
}

/**
 * This is for the paragraph's collection of tags.
 */
interface AudienceTopicsType {
  tags: AudienceTopicType[]
}
