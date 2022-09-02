import { createQueries } from 'next-drupal-query'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'
import * as ExpandableText from './expandableText'
import * as LinkTeaser from './linkTeaser'
import * as MediaImage from './mediaImage'
import * as Banner from './banners'
import * as PersonProfile from './personProfile'

export const queries = createQueries({
  'node--news_story': NewsStory,
  'node--news_story--teaser': NewsStoryTeaser,
  'node--story_listing': StoryListing,
  'node--person_profile': PersonProfile,
  'paragraph--expandable_text': ExpandableText,
  'paragraph--link_teaser': LinkTeaser,
  'media--image': MediaImage,

  // Custom Lookups
  'banner--alerts_lookup': Banner,
})
