import { createQueries } from 'next-drupal-query'
import * as PressRelease from './pressRelease'
import * as PressReleaseTeaser from './pressReleaseTeaser'
import * as PressReleaseListing from './pressReleaseListing'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'
import * as QuestionAnswer from './questionAnswer'
import * as ExpandableText from './expandableText'
import * as LinkTeaser from './linkTeaser'
import * as MediaImage from './mediaImage'
import * as MediaDocument from './mediaDocument'
import * as MediaVideo from './mediaVideo'
import * as Banners from './banners'
import * as PersonProfile from './personProfile'
import * as Button from './button'
import * as AudienceTopics from './audienceTopics'
import * as Alert from './alert'
import * as AlertBlock from './alertBlock'
import * as AlertSingle from './alertSingle'
import * as AlertNonReusable from './alertNonReusable'
import * as EmailContact from './emailContact'
import * as PhoneNumber from './phoneNumber'
import * as ContactInfo from './contactInfo'
import * as BenefitsHub from './benefitsHubLinks'
import * as Wysiwyg from './wysiwyg'
import * as StaticPathResources from './staticPathResources'
import * as HeaderFooter from './headerFooter'
import * as ProcessList from './processList'
import * as PromoBlock from './promoBlock'
import * as Event from './event'
import * as EventTeaser from './eventTeaser'
import * as EventListing from './eventListing'
import * as VamcEhr from './vamcEhr'
import * as FeaturedContent from './featuredContent'
import * as Accordion from './accordion'
import * as SupportServices from './supportServices'
import * as ResourcesSupport from './resourcesSupport'
import * as CollapsiblePanel from './collapsiblePanel'
import * as CollapsiblePanelItem from './collapsiblePanelItem'
import * as NumberCallout from './numberCallout'
import * as Table from './table'
import * as ReactWidget from './reactWidget'
import * as QaParagraph from './qaParagraph'
import * as QaSection from './qaSection'
import * as QaGroup from './qaGroup'
import * as VetCenter from './vetCenter'
import * as HealthServices from './healthServices'
import * as HealthCareLocalFacility from './healthCareLocalFacility'
import {
  ResourceType,
  ParagraphResourceType,
  RESOURCE_TYPES,
  PARAGRAPH_RESOURCE_TYPES,
  PageResourceType,
} from '@/lib/constants/resourceTypes'

export const QUERIES_MAP = {
  // Standard Drupal entity data queries
  // Nodes
  [RESOURCE_TYPES.STORY]: NewsStory,
  [`${RESOURCE_TYPES.STORY}--teaser` as const]: NewsStoryTeaser,
  [RESOURCE_TYPES.STORY_LISTING]: StoryListing,
  [RESOURCE_TYPES.QA]: QuestionAnswer,
  [RESOURCE_TYPES.EVENT]: Event,
  [`${RESOURCE_TYPES.EVENT}--teaser` as const]: EventTeaser,
  [RESOURCE_TYPES.EVENT_LISTING]: EventListing,
  [RESOURCE_TYPES.PERSON_PROFILE]: PersonProfile,
  [RESOURCE_TYPES.PRESS_RELEASE]: PressRelease,
  [`${RESOURCE_TYPES.PRESS_RELEASE}--teaser` as const]: PressReleaseTeaser,
  [RESOURCE_TYPES.PRESS_RELEASE_LISTING]: PressReleaseListing,
  [RESOURCE_TYPES.BENEFITS_HUB]: BenefitsHub, // "Benefits Hub Landing Page"
  [RESOURCE_TYPES.SUPPORT_SERVICES]: SupportServices,
  [RESOURCE_TYPES.RESOURCES_SUPPORT]: ResourcesSupport,
  [RESOURCE_TYPES.VET_CENTER]: VetCenter,
  [RESOURCE_TYPES.HEALTH_SERVICES]: HealthServices,
  [RESOURCE_TYPES.HEALTH_CARE_LOCAL_FACILITY]: HealthCareLocalFacility,

  // Paragraphs
  [PARAGRAPH_RESOURCE_TYPES.ACCORDION_ITEM]: Accordion,
  [PARAGRAPH_RESOURCE_TYPES.ALERT]: Alert,
  [PARAGRAPH_RESOURCE_TYPES.ALERT_NON_REUSABLE]: AlertNonReusable,
  [PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE]: AlertSingle,
  [PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS]: AudienceTopics,
  [PARAGRAPH_RESOURCE_TYPES.BUTTON]: Button,
  [PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL]: CollapsiblePanel,
  [PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL_ITEM]: CollapsiblePanelItem,
  [PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION]: ContactInfo,
  [PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT]: EmailContact,
  [PARAGRAPH_RESOURCE_TYPES.EXPANDABLE_TEXT]: ExpandableText,
  [PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT]: FeaturedContent,
  [PARAGRAPH_RESOURCE_TYPES.LINK_TEASER]: LinkTeaser,
  [PARAGRAPH_RESOURCE_TYPES.NUMBER_CALLOUT]: NumberCallout,
  [PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT]: PhoneNumber,
  [PARAGRAPH_RESOURCE_TYPES.PROCESS_LIST]: ProcessList,
  [PARAGRAPH_RESOURCE_TYPES.QA]: QaParagraph,
  [PARAGRAPH_RESOURCE_TYPES.QA_SECTION]: QaSection,
  [PARAGRAPH_RESOURCE_TYPES.QA_GROUP]: QaGroup,
  [PARAGRAPH_RESOURCE_TYPES.REACT_WIDGET]: ReactWidget,
  [PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000]: Wysiwyg,
  [PARAGRAPH_RESOURCE_TYPES.TABLE]: Table,
  [PARAGRAPH_RESOURCE_TYPES.WYSIWYG]: Wysiwyg,

  // Blocks
  'block--alert': AlertBlock,
  'block_content--promo': PromoBlock,

  // Media
  'media--image': MediaImage,
  'media--document': MediaDocument,
  'media--video': MediaVideo,

  // Custom queries
  'banner-data': Banners,
  'header-footer-data': HeaderFooter,

  // Static Path Generation
  'static-path-resources': StaticPathResources,

  // Static JSON files
  'vamc-ehr': VamcEhr,
}

// All resource types that have a `params` function defined
export type ParamsType = {
  [K in keyof typeof QUERIES_MAP]: 'params' extends keyof (typeof QUERIES_MAP)[K]
    ? K
    : never
}[keyof typeof QUERIES_MAP]

// All resource types that have a `data` function defined
export type QueryableType = {
  [K in keyof typeof QUERIES_MAP]: 'data' extends keyof (typeof QUERIES_MAP)[K]
    ? K
    : never
}[keyof typeof QUERIES_MAP]

// (Node) Resources that have a `data` function defined
export type QueryableResourceType = QueryableType & ResourceType

// Page-level (node) resources that have a `data` function defined
export type QueryablePageResourceType = QueryableType & PageResourceType

// Paragraph resources that have a `data` function defined
export type QueryableParagraphResourceType = QueryableType &
  ParagraphResourceType

// All resource types that have a `formatter` function defined
export type FormattableType = {
  [K in keyof typeof QUERIES_MAP]: 'formatter' extends keyof (typeof QUERIES_MAP)[K]
    ? K
    : never
}[keyof typeof QUERIES_MAP]

// (Node) Resources that have a `formatter` function defined
export type FormattableResourceType = FormattableType & ResourceType

// Page-level (node) resource types that have a `formatter` function defined
export type FormattablePageResourceType = FormattableType & PageResourceType

// Paragraph resources that have a `formatter` function defined
export type FormattableParagraphResourceType = FormattableType &
  ParagraphResourceType

// The types of (node) resources returned from `formatter` functions
export type FormattedResource = ReturnType<
  (typeof QUERIES_MAP)[FormattableResourceType]['formatter']
>

// The types of page-level (node) resources returned from `formatter` functions
export type FormattedPageResource = ReturnType<
  (typeof QUERIES_MAP)[FormattablePageResourceType]['formatter']
>

// The types of paragraph resources returned from `formatter` functions
export type FormattedParagraph = ReturnType<
  (typeof QUERIES_MAP)[FormattableParagraphResourceType]['formatter']
>

// The type of resource passed to the formatter for the
// given Drupal-named type of resource.
// E.g. FormattedResourceByType<`node--news_story`> = NodeNewsStory
export type DrupalResourceByType<
  T extends (ResourceType | ParagraphResourceType) & keyof typeof QUERIES_MAP,
> = Parameters<(typeof QUERIES_MAP)[T]['formatter']>[0]

// The type of resource returned by the formatter for the
// given Drupal-named type of resource.
// E.g. FormattedResourceByType<`node--news_story`> = NewsStory
export type FormattedResourceByType<
  T extends (ResourceType | ParagraphResourceType) & keyof typeof QUERIES_MAP,
> = ReturnType<(typeof QUERIES_MAP)[T]['formatter']>

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

export const queries = createQueries(QUERIES_MAP)
