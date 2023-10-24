import { createQueries } from 'next-drupal-query'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'
import * as QuestionAnswer from './questionAnswer'
import * as ExpandableText from './expandableText'
import * as LinkTeaser from './linkTeaser'
import * as MediaImage from './mediaImage'
import * as Banner from './banners'
import * as PersonProfile from './personProfile'
import * as Button from './button'
import * as AudienceTopics from './audienceTopics'
import * as Alert from './alert'
import * as EmailContact from './emailContact'
import * as BenefitsHub from './benefitsHub'
import * as Wysiwyg from './wysiwyg'
import * as StaticPathResources from './staticPathResources'
import * as HeaderFooter from './headerFooter'
import * as PromoBlock from './promoBlock'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const QUERIES_MAP = {
  // standard Drupal entity data queries
  'node--news_story': NewsStory,
  'node--news_story--teaser': NewsStoryTeaser,
  'node--story_listing': StoryListing,
  'node--q_a': QuestionAnswer,
  'node--person_profile': PersonProfile,
  'node--landing_page': BenefitsHub, // "Benefits Hub Landing Page"
  'paragraph--audience_topics': AudienceTopics,
  'paragraph--button': Button,
  'paragraph--email_contact': EmailContact,
  'paragraph--expandable_text': ExpandableText,
  'paragraph--link_teaser': LinkTeaser,
  'paragraph--rich_text_char_limit_1000': Wysiwyg,
  'paragraph--wysiwyg': Wysiwyg,
  'media--image': MediaImage,
  'block--alert': Alert,
  'block_content--promo': PromoBlock,

  // Custom queries
  'banner--alerts_lookup': Banner,
  'header-footer-data': HeaderFooter,

  // Static Path Generation
  'static-path-resources': StaticPathResources,
}

// Type representing all possible object shapes returned from querying and formatting Drupal data.
// E.g. StoryListingType | NewsStoryType | (other future resoource type)
// Type constructed by:
//  1. Consider all keys of QUERIES_MAP above
//  2. Take subset of those keys that appear in RESOURCE_TYPES (imported)
//  3. Map that subset of keys to their respective values, which are modules for querying data
//  4. Within each of those modules, grab the return type of the `formatter` function
export type FormattedResource = ReturnType<
  (typeof QUERIES_MAP)[(typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]]['formatter']
>

export const queries = createQueries(QUERIES_MAP)
