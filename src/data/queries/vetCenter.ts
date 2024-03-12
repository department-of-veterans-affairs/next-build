import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'

import { queries } from '.'
import { NodeVetCenter } from '@/types/drupal/node'
import { VetCenter as FormattedVetCenter } from '@/types/formatted/vetCenter'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--vet_center.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addInclude([
      'field_media',
      'field_media.image',
      'field_administration',
      'field_prepare_for_visit',
      'field_vet_center_feature_content',
      'field_vet_center_feature_content.field_cta',
      'field_health_services',
      'field_health_services.field_service_name_and_descripti',
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
    'node--vet_center_facility_health_servi',
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

    const featuredContentObject = {
      field_description: field_description[0],
      field_section_header: field_section_header[0].value,
      field_cta: {
        id: field_cta[0].target_id || null,
        field_button_label: field_cta[0].field_button_label[0].value || null,
        field_button_link: field_cta[0].field_button_link[0] || null,
      },
    }
    const combinedArray = [
      featuredContentObject,
      ...vetCenterFeatureContentArray,
    ]
    const formattedFeaturedContentArray = combinedArray.map((item) =>
      queries.formatData('paragraph--featured_content', item)
    )
    return formattedFeaturedContentArray
  }

  return {
    ...entityBaseFields(entity),
    address: entity.field_address,
    ccNonTraditionalHours: {
      contentType: entity.field_cc_non_traditional_hours.fetched_bundle,
      content: {
        html: entity.field_cc_non_traditional_hours.fetched.field_wysiwyg[0]
          .processed,
      },
    },
    ccVetCenterCallCenter: {
      contentType: entity.field_cc_vet_center_call_center.fetched_bundle,
      content: {
        html: entity.field_cc_vet_center_call_center.fetched.field_wysiwyg[0]
          .processed,
      },
    },
    ccVetCenterFaqs: entity.field_cc_vet_center_faqs,
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
    prepareForVisit: entity.field_prepare_for_visit,
    vetCenterFeatureContent: queries.formatData(
      'paragraph--featured_content',
      entity.field_vet_center_feature_content[0]
    ),
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
    path: entity.path.alias,
  }
}
