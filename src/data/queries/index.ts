import { createQueries } from 'next-drupal-query'
import * as Accordion from '@/data/queries/accordion'
import * as Alert from '@/data/queries/alert'
import * as AlertBlock from '@/data/queries/alertBlock'
import * as AlertNonReusable from '@/data/queries/alertNonReusable'
import * as AlertSingle from '@/data/queries/alertSingle'
import * as AudienceTopics from '@/data/queries/audienceTopics'
import * as Banners from '@/data/queries/banners'
import * as BenefitsHub from '@/data/queries/benefitsHubLinks'
import * as Button from '@/data/queries/button'
import * as CollapsiblePanel from '@/data/queries/collapsiblePanel'
import * as CollapsiblePanelItem from '@/data/queries/collapsiblePanelItem'
import * as ContactInfo from '@/data/queries/contactInfo'
import * as EmailContact from '@/data/queries/emailContact'
import * as Event from '@/products/event/query'
import * as EventListing from '@/products/eventListing/query'
import * as EventTeaser from '@/data/queries/eventTeaser'
import * as ExpandableText from '@/data/queries/expandableText'
import * as FeaturedContent from '@/data/queries/featuredContent'
import * as HeaderFooter from '@/data/queries/headerFooter'
import * as HealthCareLocalFacility from '@/data/queries/healthCareLocalFacility'
import * as HealthServices from '@/data/queries/healthServices'
import * as LinkTeaser from '@/data/queries/linkTeaser'
import * as MediaDocument from '@/data/queries/mediaDocument'
import * as MediaImage from '@/data/queries/mediaImage'
import * as MediaVideo from '@/data/queries/mediaVideo'
import * as NewsStory from '@/data/queries/newsStory'
import * as NewsStoryTeaser from '@/data/queries/newsStoryTeaser'
import * as NumberCallout from '@/data/queries/numberCallout'
import * as PersonProfile from '@/data/queries/personProfile'
import * as PhoneNumber from '@/data/queries/phoneNumber'
import * as PressRelease from '@/data/queries/pressRelease'
import * as PressReleaseListing from '@/data/queries/pressReleaseListing'
import * as PressReleaseTeaser from '@/data/queries/pressReleaseTeaser'
import * as ProcessList from '@/data/queries/processList'
import * as PromoBlock from '@/data/queries/promoBlock'
import * as QaGroup from '@/data/queries/qaGroup'
import * as QaParagraph from '@/data/queries/qaParagraph'
import * as QaSection from '@/data/queries/qaSection'
import * as QuestionAnswer from '@/data/queries/questionAnswer'
import * as ReactWidget from '@/data/queries/reactWidget'
import * as ResourcesSupport from '@/data/queries/resourcesSupport'
import * as StaticPathResources from '@/data/queries/staticPathResources'
import * as StoryListing from '@/data/queries/storyListing'
import * as SupportServices from '@/data/queries/supportServices'
import * as Table from '@/data/queries/table'
import * as VamcEhr from '@/data/queries/vamcEhr'
import * as VetCenter from '@/data/queries/vetCenter'
import * as VetCenterOutstation from '@/data/queries/vetCenterOutstation'
import * as Wysiwyg from '@/data/queries/wysiwyg'
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
  [RESOURCE_TYPES.BENEFITS_HUB]: BenefitsHub, // "Benefits Hub Landing Page"
  [RESOURCE_TYPES.EVENT]: Event,
  [`${RESOURCE_TYPES.EVENT}--teaser` as const]: EventTeaser,
  [RESOURCE_TYPES.EVENT_LISTING]: EventListing,
  [RESOURCE_TYPES.HEALTH_SERVICES]: HealthServices,
  [RESOURCE_TYPES.STORY]: NewsStory,
  [`${RESOURCE_TYPES.STORY}--teaser` as const]: NewsStoryTeaser,
  [RESOURCE_TYPES.STORY_LISTING]: StoryListing,
  [RESOURCE_TYPES.QA]: QuestionAnswer,
  [RESOURCE_TYPES.STAFF_PROFILE]: PersonProfile,
  [RESOURCE_TYPES.PRESS_RELEASE]: PressRelease,
  [`${RESOURCE_TYPES.PRESS_RELEASE}--teaser` as const]: PressReleaseTeaser,
  [RESOURCE_TYPES.PRESS_RELEASE_LISTING]: PressReleaseListing,
  [RESOURCE_TYPES.RESOURCES_SUPPORT]: ResourcesSupport,
  [RESOURCE_TYPES.SUPPORT_SERVICES]: SupportServices,
  [RESOURCE_TYPES.VAMC_FACILITY]: HealthCareLocalFacility,
  [RESOURCE_TYPES.VET_CENTER]: VetCenter,
  [RESOURCE_TYPES.VET_CENTER_OUTSTATION]: VetCenterOutstation,

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
