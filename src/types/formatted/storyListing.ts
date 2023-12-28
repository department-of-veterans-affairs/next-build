import { PublishedEntity } from './publishedEntity'
import { NewsStoryTeaser } from '@/types/formatted/newsStory'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { BreadcrumbItem } from '@/types/drupal/field_type'
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
}
