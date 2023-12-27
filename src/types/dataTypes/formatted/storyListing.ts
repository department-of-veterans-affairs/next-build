import { PublishedEntity } from './publishedEntity'
import { NewsStoryTeaser } from '@/types/dataTypes/formatted/newsStory'
import { SideNavMenu } from '@/types/dataTypes/formatted/sideNav'

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
}
