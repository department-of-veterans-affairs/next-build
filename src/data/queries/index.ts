import { createQueries } from 'next-drupal-query'
import * as NewsStoryFull from './NewsStoryFull'
import * as StoryListingFull from './StoryListingFull'
import * as StoryListingNewsStories from './StoryListingNewsStories'
export const queries = createQueries({
  'node--news_story': NewsStoryFull,
  'node--story_listing': StoryListingFull,
  'story_listing--news_stories': StoryListingNewsStories,
})
