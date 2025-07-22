import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { NewsStoryTeaser } from '@/products/newsStory/formatted-type'
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
}
