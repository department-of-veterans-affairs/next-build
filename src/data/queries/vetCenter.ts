import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { queries } from '.'
import { NodeVetCenter } from '@/types/drupal/node'
import { VetCenter as FormattedVetCenter } from '@/types/formatted/vetCenter'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { FeaturedContent } from '@/types/formatted/featuredContent'
import { Button } from '@/types/formatted/button'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { getNestedIncludes } from '@/lib/utils/queries'
import { buildFormattedFaqs } from './buildFormattedFaqs'

// Define the query params for fetching node--vet_center.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    'field_administration',
    'field_prepare_for_visit',
    ...getNestedIncludes(
      'field_vet_center_feature_content',
      PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT
    ),
    ...getNestedIncludes(
      'field_health_services',
      RESOURCE_TYPES.HEALTH_SERVICES
    ),
  ])
}

// Define the option types for the data loader.
export type VetCenterDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VetCenterDataOpts, NodeVetCenter> = async (
  opts
): Promise<NodeVetCenter> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VET_CENTER,
    params
  )) as NodeVetCenter
  return entity
}

export const formatter: QueryFormatter<NodeVetCenter, FormattedVetCenter> = (
  entity: NodeVetCenter
) => {
  // format health services / filter per category
  const healthServicesArray = queries.formatData(
    RESOURCE_TYPES.HEALTH_SERVICES,
    entity.field_health_services
  )
  const counselingServicesArray = healthServicesArray.filter(
    (h) => h && h.vetCenterTypeOfCare === 'counseling'
  )
  const referralServicesArray = healthServicesArray.filter(
    (h) => h && h.vetCenterTypeOfCare === 'referral'
  )
  const otherServicesArray = healthServicesArray.filter(
    (h) =>
      h &&
      h.vetCenterTypeOfCare !== 'counseling' &&
      h.vetCenterTypeOfCare !== 'referral'
  )

  // format and combine featured content
  const buildFeaturedContentArray = (
    ccFeaturedContent,
    vetCenterFeatureContentArray
  ) => {
    if (!ccFeaturedContent || !ccFeaturedContent.fetched) {
      return vetCenterFeatureContentArray
    }

    const { field_description, field_section_header, field_cta } =
      ccFeaturedContent.fetched

    // Centralized content needs to be normalized to match the shape of a standard drupal paragraph in order to be formatted
    const featuredContentObject = {
      field_description: field_description[0],
      field_section_header: field_section_header[0].value,
      type: PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT as FeaturedContent['type'],
      id: ccFeaturedContent.target_id || '',

      field_cta: {
        id: field_cta[0].target_id || null,
        field_button_label: field_cta[0].field_button_label[0].value || null,
        field_button_link: field_cta[0].field_button_link[0] || null,
        type: PARAGRAPH_RESOURCE_TYPES.BUTTON as Button['type'],
        drupal_internal__id: field_cta[0].target_id,
      },
    }
    const combinedArray = [
      featuredContentObject,
      ...vetCenterFeatureContentArray,
    ]
    const formattedFeaturedContentArray = combinedArray.map((item) =>
      queries.formatData(PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT, item)
    )
    return formattedFeaturedContentArray
  }

  return {
    ...entityBaseFields(entity),
    address: entity.field_address,
    ccNonTraditionalHours: {
      type: PARAGRAPH_RESOURCE_TYPES.WYSIWYG as Wysiwyg['type'],
      id: entity.id || null,
      html: entity.field_cc_non_traditional_hours.fetched.field_wysiwyg[0]
        .processed,
    },
    ccVetCenterCallCenter: {
      type: PARAGRAPH_RESOURCE_TYPES.WYSIWYG as Wysiwyg['type'],
      html: entity.field_cc_vet_center_call_center.fetched.field_wysiwyg[0]
        .processed,
      id: entity.id || null,
    },
    ccVetCenterFaqs: buildFormattedFaqs(entity.field_cc_vet_center_faqs),
    featuredContent: buildFeaturedContentArray(
      entity.field_cc_vet_center_featured_con,
      entity.field_vet_center_feature_content
    ),
    ccVetCenterFeaturedCon: entity.field_cc_vet_center_featured_con,
    geolocation: entity.field_geolocation,
    introText: entity.field_intro_text,
    lastSavedByAnEditor: entity.field_last_saved_by_an_editor ?? null,
    officeHours: entity.field_office_hours,
    officialName: entity.field_official_name,
    operatingStatusFacility: entity.field_operating_status_facility,
    operatingStatusMoreInfo: entity.field_operating_status_more_info ?? null,
    phoneNumber: entity.field_phone_number,
    timezone: entity.field_timezone,
    administration: entity.field_administration,

    healthServices: healthServicesArray,
    counselingHealthServices: counselingServicesArray,
    referralHealthServices: referralServicesArray,
    otherHealthServices: otherServicesArray,
    image: queries.formatData('media--image', entity.field_media),
    prepareForVisit: entity.field_prepare_for_visit.map(
      (prepareForVisitItem) => {
        return queries.formatData(
          PARAGRAPH_RESOURCE_TYPES.ACCORDION_ITEM,
          prepareForVisitItem
        )
      }
    ),
    vetCenterFeatureContent: queries.formatData(
      PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT,
      entity.field_vet_center_feature_content[0]
    ),
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
    path: entity.path.alias,
  }
}
