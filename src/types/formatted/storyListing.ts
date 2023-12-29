import { PublishedEntity } from './publishedEntity'
import { NewsStoryTeaser } from '@/types/formatted/newsStory'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type StoryListingLink = {
  path: string
}

export type StoryListing = PublishedEntity & {
  introText: string
  stories: NewsStoryTeaser[]
  menu: SideNavMenu
  currentPage: number
  totalItems: number
  totalPages: number
  lastUpdated: string
}
