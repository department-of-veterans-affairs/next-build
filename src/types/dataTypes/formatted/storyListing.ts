import { PublishedEntity } from './publishedEntity'
import { NewsStoryTeaser } from '@/types/dataTypes/formatted/newsStory'
import { SideNavMenu } from '@/types/dataTypes/formatted/sideNav'
import { BreadcrumbItem } from '@/types/dataTypes/drupal/field_type'
import { MetaTag } from './metatags'

export type StoryListingLink = {
  path: string
}

export type StoryListing = PublishedEntity & {
  title: string
  introText: string
  stories: NewsStoryTeaser[]
  menu: SideNavMenu
  currentPage: number
  totalItems: number
  totalPages: number
  entityId: number
  entityPath: string
  breadcrumbs: BreadcrumbItem[]
  metatags: MetaTag[]
  lastSavedByAnEditor?: string
}
