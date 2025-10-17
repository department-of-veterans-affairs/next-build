import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { VetCenterOutstationPage as FormattedVetCenterOutstationPage } from './formatted-type'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { entityBaseFields } from '@/lib/drupal/query'
import { BreadcrumbItem } from '@/types/drupal/field_type'
import fs from 'fs'
import path from 'path'

// Mock data registry - in the future this will be replaced by actual Drupal queries
const MOCK_OUTSTATIONS = {
  'sepulveda-outstation': () =>
    JSON.parse(
      fs.readFileSync(
        path.join(
          process.cwd(),
          'src/components/vetCenterOutstationPage/__mocks__/sepulveda-outstation.json'
        ),
        'utf-8'
      )
    ),
}

// Define the query params (currently unused for mocks, but ready for CMS integration)
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
}

// Define the option types for the data loader
export type VetCenterOutstationPageDataOpts = {
  slug: string
  context?: ExpandedStaticPropsContext
}

// Data loader - currently loads from mock files, will be replaced with Drupal queries
export const data: QueryData<
  VetCenterOutstationPageDataOpts,
  MockData
> = async (opts): Promise<MockData> => {
  // Check if feature flag is enabled
  if (
    process.env.FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE !== 'true'
  ) {
    throw new Error('VetCenterOutstationPage feature not enabled')
  }

  // For now, we're using mock data. In the future, this will be replaced with:
  // const entity = await fetchSingleEntityOrPreview(opts, RESOURCE_TYPES.VET_CENTER_OUTSTATION, params)

  // Extract slug from the path or opts
  let slug = opts.slug
  if (!slug && opts.context?.params?.slug) {
    // Extract slug from Next.js context
    const slugArray = Array.isArray(opts.context.params.slug)
      ? opts.context.params.slug
      : [opts.context.params.slug]
    slug = slugArray[slugArray.length - 1] // Get the last segment
  }

  // Load mock data by slug
  const mockLoader = MOCK_OUTSTATIONS[slug]
  if (!mockLoader) {
    throw new Error(`Mock outstation data not found for slug: ${slug}`)
  }

  return mockLoader()
}

// Formatter - converts mock data into the formatted type structure
interface MockData {
  id: string
  type: string
  published: boolean
  title: string
  lastUpdated: string
  path: string
  breadcrumbs?: BreadcrumbItem[]
  officialName: string
  introText: string
  address: FormattedVetCenterOutstationPage['address']
  geolocation: FormattedVetCenterOutstationPage['geolocation']
  phoneNumber: string
  officeHours: FormattedVetCenterOutstationPage['officeHours']
  timezone: string
  fieldFacilityLocatorApiId: string
  operatingStatusFacility: FormattedVetCenterOutstationPage['operatingStatusFacility']
  operatingStatusMoreInfo: string | null
  missionExplainer: FormattedVetCenterOutstationPage['missionExplainer'] | null
  image: FormattedVetCenterOutstationPage['image']
  bannerImage: FormattedVetCenterOutstationPage['bannerImage'] | null
  prepareForVisit: FormattedVetCenterOutstationPage['prepareForVisit']
  featuredContent: FormattedVetCenterOutstationPage['featuredContent']
  healthServices?: FormattedVetCenterOutstationPage['healthServices']
  counselingHealthServices?: FormattedVetCenterOutstationPage['counselingHealthServices']
  referralHealthServices?: FormattedVetCenterOutstationPage['referralHealthServices']
  otherHealthServices?: FormattedVetCenterOutstationPage['otherHealthServices']
  ccNonTraditionalHours: FormattedVetCenterOutstationPage['ccNonTraditionalHours']
  ccVetCenterCallCenter: FormattedVetCenterOutstationPage['ccVetCenterCallCenter']
  ccVetCenterFaqs: FormattedVetCenterOutstationPage['ccVetCenterFaqs']
  lastSavedByAnEditor: string | null
  administration: FormattedVetCenterOutstationPage['administration']
  parentVetCenter: FormattedVetCenterOutstationPage['parentVetCenter']
}

export const formatter: QueryFormatter<
  MockData,
  FormattedVetCenterOutstationPage
> = (input: MockData): FormattedVetCenterOutstationPage => {
  const mockData = input as MockData
  // Validate required fields exist and are the correct type
  if (typeof mockData.id !== 'string') {
    throw new Error('Mock data missing required string field: id')
  }
  if (typeof mockData.type !== 'string') {
    throw new Error('Mock data missing required string field: type')
  }
  if (typeof mockData.published !== 'boolean') {
    throw new Error('Mock data missing required boolean field: published')
  }
  if (typeof mockData.title !== 'string') {
    throw new Error('Mock data missing required string field: title')
  }
  if (typeof mockData.lastUpdated !== 'string') {
    throw new Error('Mock data missing required string field: lastUpdated')
  }

  // Format the mock data to match our FormattedVetCenterOutstationPage type
  const result: FormattedVetCenterOutstationPage = {
    // Base entity fields - manually constructed for mock data
    id: mockData.id,
    entityId: null, // Mock data doesn't have drupal_internal__nid
    entityPath: mockData.path,
    type: mockData.type,
    published: mockData.published,
    moderationState: null, // Not needed for mock
    title: mockData.title,
    metatags: null, // Not needed for mock
    breadcrumbs: mockData.breadcrumbs || [],
    lastUpdated: mockData.lastUpdated,

    // Additional information
    officialName: mockData.officialName,
    introText: mockData.introText,

    // Location and contact - casting to match exact interface types
    address: mockData.address,
    geolocation: mockData.geolocation,
    phoneNumber: mockData.phoneNumber,
    officeHours: mockData.officeHours,
    timezone: mockData.timezone,
    fieldFacilityLocatorApiId: mockData.fieldFacilityLocatorApiId,

    // Operating status
    operatingStatusFacility: mockData.operatingStatusFacility,
    operatingStatusMoreInfo: mockData.operatingStatusMoreInfo,

    // Mission/commitment (reused from parent)
    missionExplainer: mockData.missionExplainer,

    // Images
    image: mockData.image,
    bannerImage: mockData.bannerImage,

    // Interactive sections
    prepareForVisit: mockData.prepareForVisit,
    featuredContent: mockData.featuredContent,

    // Health services - grouped by type
    healthServices: mockData.healthServices || [],
    counselingHealthServices: mockData.counselingHealthServices || [],
    referralHealthServices: mockData.referralHealthServices || [],
    otherHealthServices: mockData.otherHealthServices || [],

    // Centralized content
    ccNonTraditionalHours: mockData.ccNonTraditionalHours,
    ccVetCenterCallCenter: mockData.ccVetCenterCallCenter,
    ccVetCenterFaqs: mockData.ccVetCenterFaqs,

    // Metadata
    lastSavedByAnEditor: mockData.lastSavedByAnEditor,
    administration: mockData.administration,
    path: mockData.path,

    // Parent Vet Center information
    parentVetCenter: mockData.parentVetCenter,
  }

  return result
}

// Helper function to get available mock outstation slugs (used by dev routing)
export const getAvailableOutstationSlugs = (): string[] => {
  return Object.keys(MOCK_OUTSTATIONS)
}
