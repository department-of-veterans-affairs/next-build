import { createQueries } from 'next-drupal-query'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'
import * as QuestionAnswer from './questionAnswer'
import * as ExpandableText from './expandableText'
import * as LinkTeaser from './linkTeaser'
import * as MediaImage from './mediaImage'
import * as Banners from './banners'
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
import * as Event from './event'
import * as EventTeaser from './eventTeaser'
import * as EventListing from './eventListing'
import * as VamcEhr from './vamcEhr'
import { ResourceType } from '@/lib/constants/resourceTypes'

export const QUERIES_MAP = {
  // standard Drupal entity data queries
  'node--news_story': NewsStory,
  'node--news_story--teaser': NewsStoryTeaser,
  'node--story_listing': StoryListing,
  'node--q_a': QuestionAnswer,
  'node--event': Event,
  'node--event--teaser': EventTeaser,
  'node--event_listing': EventListing,
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
  'banner-data': Banners,
  'header-footer-data': HeaderFooter,

  // Static Path Generation
  'static-path-resources': StaticPathResources,

  // Static JSON files
  'vamc-ehr': VamcEhr,
}

// Type representing all possible object shapes returned from querying and formatting Drupal data.
// E.g. StoryListingType | NewsStoryType | (other future resoource type)
// Type constructed by:
//  1. Consider all ResourceType types
//  2. Take subset of those types that have a key in QUERIES_MAP
//  3. Map that subset of keys to their respective values, which are modules for querying data
//  4. Within each of those modules, grab the return type of the `formatter` function
export type FormattedResource = ReturnType<
  (typeof QUERIES_MAP)[ResourceType & keyof typeof QUERIES_MAP]['formatter']
>

// Type representing all keys from QUERIES_MAP whose values have a 'data' function.
// This type is used, for example, to type values we can pass to queries.getData()
// E.g. `node--news_story` is included because src/data/queries/newsStory.ts has a function `data`
// E.g. `block--alert` is NOT included because src/data/queries/alert.ts does not have a function `data` (only `formatter`)
export type QueryType = {
  [K in keyof typeof QUERIES_MAP]: 'data' extends keyof (typeof QUERIES_MAP)[K]
    ? K
    : never
}[keyof typeof QUERIES_MAP]

// Type mapping keys from QUERIES_MAP to the types of opts passable to the respective `data` function
//  of the key's value.
// This type is used, for example, to ensure that StaticJsonFile configurations define an acceptable
//  value for `queryOpts`.
// E.g. `node--news_story` => NewsStoryDataOpts because the `data` function in src/data/queries/newsStory.ts
//  is typed QueryData<NewsStoryDataOpts, NodeNewsStory> (note first parameter)
/*eslint-disable @typescript-eslint/no-explicit-any*/
type AllQueryDataOptsMap = {
  [K in keyof typeof QUERIES_MAP]: 'data' extends keyof (typeof QUERIES_MAP)[K]
    ? (typeof QUERIES_MAP)[K] extends { data: (...args: infer U) => any }
      ? U[0]
      : never
    : never
}
/*eslint-enable @typescript-eslint/no-explicit-any*/
type NonNeverKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K
}[keyof T]
export type QueryDataOptsMap = Pick<
  AllQueryDataOptsMap,
  NonNeverKeys<AllQueryDataOptsMap>
>

// Type representing resource types that have queries defined
// E.g. `node--news_story` is included because it's a resource type and has an entry in QUERIES_MAP
// E.g. `node--health_care_local_facility` is not included because it does not have an entry in QUERIES_MAP
// E.g. `vamc-ehr` is not included because it's not a resource type
export type QueryResourceType = QueryType & ResourceType

export const queries = createQueries(QUERIES_MAP)
