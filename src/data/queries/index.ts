import { createQueries } from 'next-drupal-query'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'
import * as LinkTeaser from './linkTeaser'
import * as ExpandableText from './expandableText'
import * as LinkTeaser from './linkTeaser'
import * as ExpandableText from './expandableText'

export const queries = createQueries({
  'node--news_story': NewsStory,
  'node--news_story--teaser': NewsStoryTeaser,
  'node--story_listing': StoryListing,
  'paragraph--link_teaser': LinkTeaser,
  'paragraph--expandable_text': ExpandableText,
  'paragraph--link_teaser': LinkTeaser,
  'paragraph--expandable_text': ExpandableText,
})
