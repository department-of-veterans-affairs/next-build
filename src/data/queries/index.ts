import { createQueries } from 'next-drupal-query'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'

export const queries = createQueries({
  'node--news_story': NewsStory,
  'node--news_story--teaser': NewsStoryTeaser,
  'node--story_listing': StoryListing,
})
