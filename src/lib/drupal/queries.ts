import { createQueries } from 'next-drupal-query'
import * as Accordion from '@/components/accordion/query'
import * as Alert from '@/components/alert/query'
import * as AlertBlock from '@/components/alertBlock/query'
import * as AlertNonReusable from '@/components/alertNonReusable/query'
import * as AlertSingle from '@/components/alertSingle/query'
import * as AudienceTopics from '@/components/audienceTopics/query'
import * as Banners from '@/components/banner/query'
import * as BenefitsHub from '@/components/benefitsHubLinks/query'
import * as Button from '@/components/button/query'
import * as CollapsiblePanel from '@/components/collapsiblePanel/query'
import * as CollapsiblePanelItem from '@/components/collapsiblePanelItem/query'
import * as ContactInfo from '@/components/contactInfo/query'
import * as EmailContact from '@/components/emailContact/query'
import * as Event from '../../components/event/query'
import * as EventListing from '../../components/eventListing/query'
import * as EventTeaser from '@/components/eventTeaser/query'
import * as ExpandableText from '@/components/expandableText/query'
import * as FeaturedContent from '@/components/featuredContent/query'
import * as Footer from '@/components/footer/query'
import * as Header from '@/components/header/query'
import * as HealthCareLocalFacility from '../../components/vamcFacility/query'
import * as LinkTeaser from '@/components/linkTeaser/query'
import * as ListOfLinkTeasers from '@/components/listOfLinkTeasers/query'
import * as LocationsListing from '../../components/locationsListing/query'
import * as MediaDocument from '@/components/mediaDocument/query'
import * as MediaImage from '@/components/mediaImage/query'
import * as MediaVideo from '@/components/mediaVideo/query'
import * as NewsStory from '../../components/newsStory/query'
import * as NewsStoryTeaser from '@/components/newsStoryTeaser/query'
import * as NumberCallout from '@/components/numberCallout/query'
import * as PersonProfile from '../../components/staffProfile/query'
import * as PhoneNumber from '@/components/phoneNumber/query'
import * as PressRelease from '../../components/pressRelease/query'
import * as PressReleaseListing from '../../components/pressReleaseListing/query'
import * as PressReleaseTeaser from '@/components/pressReleaseTeaser/query'
import * as ProcessList from '@/components/processList/query'
import * as PromoBlock from '@/components/promoBlock/query'
import * as QaGroup from '@/components/qaGroup/query'
import * as QaParagraph from '@/components/qaParagraph/query'
import * as QaSection from '@/components/qaSection/query'
import * as QuestionAnswer from '../../components/questionAnswer/query'
import * as ReactWidget from '@/components/reactWidget/query'
import * as ResourcesSupport from '../../components/resourcesSupport/query'
import * as StaticPathResources from '@/components/staticPathResources/query'
import * as StoryListing from '../../components/storyListing/query'
import * as SupportServices from '@/components/supportServices/query'
import * as Table from '@/components/table/query'
import * as VamcEhr from '@/components/vamcEhr/query'
import * as VamcSystem from '../../components/vamcSystem/query'
import * as VamcSystemRegisterForCare from '../../components/vamcSystemRegisterForCare/query'
import * as VamcSystemVaPolice from '../../components/vamcSystemVaPolice/query'
import * as VetCenter from '../../components/vetCenter/query'
import * as VetCenterHealthServices from '@/components/vetCenterHealthServices/query'
import * as VetCenterOutstation from '../../components/vetCenterOutstation/query'
import * as VetCenterLocationListing from '../../components/vetCenterLocationListing/query'
import * as Wysiwyg from '@/components/wysiwyg/query'
import * as LeadershipListing from '../../components/leadershipListing/query'
import * as VbaFacility from '../../components/vbaFacility/query'
import * as HealthServicesListing from '../../components/vamcHealthServicesListing/query'
import * as VamcOperatingStatusAndAlerts from '../../components/vamcOperatingStatusAndAlerts/query'
import * as VamcSystemPoliciesPage from '../../components/vamcSystemPoliciesPage/query'
import * as ServiceLocation from '@/components/serviceLocation/query'
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
  [RESOURCE_TYPES.VET_CENTER_HEALTH_SERVICES]: VetCenterHealthServices,
  [RESOURCE_TYPES.LOCATIONS_LISTING]: LocationsListing,
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
  [RESOURCE_TYPES.VAMC_SYSTEM]: VamcSystem,
  [RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE]: VamcSystemRegisterForCare,
  [RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE]: VamcSystemVaPolice,
  [RESOURCE_TYPES.VET_CENTER]: VetCenter,
  [RESOURCE_TYPES.VET_CENTER_OUTSTATION]: VetCenterOutstation,
  [RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING]: VetCenterLocationListing,
  [RESOURCE_TYPES.LEADERSHIP_LISTING]: LeadershipListing,
  [RESOURCE_TYPES.VBA_FACILITY]: VbaFacility,
  [RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING]: HealthServicesListing,
  [RESOURCE_TYPES.VAMC_OPERATING_STATUS_AND_ALERTS]:
    VamcOperatingStatusAndAlerts,
  [RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE]: VamcSystemPoliciesPage,

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
  [PARAGRAPH_RESOURCE_TYPES.LIST_OF_LINK_TEASERS]: ListOfLinkTeasers,
  [PARAGRAPH_RESOURCE_TYPES.NUMBER_CALLOUT]: NumberCallout,
  [PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT]: PhoneNumber,
  [PARAGRAPH_RESOURCE_TYPES.PROCESS_LIST]: ProcessList,
  [PARAGRAPH_RESOURCE_TYPES.QA]: QaParagraph,
  [PARAGRAPH_RESOURCE_TYPES.QA_SECTION]: QaSection,
  [PARAGRAPH_RESOURCE_TYPES.QA_GROUP]: QaGroup,
  [PARAGRAPH_RESOURCE_TYPES.REACT_WIDGET]: ReactWidget,
  [PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000]: Wysiwyg,
  [PARAGRAPH_RESOURCE_TYPES.SERVICE_LOCATION]: ServiceLocation,
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
  'header-data': Header,
  'footer-data': Footer,

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
// E.g. `node--news_story` => NewsStoryDataOpts because the `data` function in src/components/newsStory/query.ts
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
