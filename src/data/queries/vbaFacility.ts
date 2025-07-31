import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVbaFacility } from '@/types/drupal/node'
import { VbaFacility } from '@/types/formatted/vbaFacility'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { formatter as formatFeaturedContent } from '@/data/queries/featuredContent'
import { formatter as formatAccordionItem } from '@/data/queries/accordion'

import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { PhoneContact } from '@/types/formatted/contactInfo'

// Define the query params for fetching node--vba_facility.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_media',
    'field_media.image',
    'field_prepare_for_visit',
    ...getNestedIncludes(
      'field_local_spotlight',
      PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT
    ),
  ])
}

// Define the option types for the data loader.
export type VbaFacilityDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<VbaFacilityDataOpts, NodeVbaFacility> = async (
  opts
): Promise<NodeVbaFacility> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VBA_FACILITY,
    params
  )) as NodeVbaFacility

  return entity
}

export const formatter: QueryFormatter<NodeVbaFacility, VbaFacility> = (
  entity: NodeVbaFacility
) => {
  const featuredContent = [
    formatFeaturedContent({
      type: 'paragraph--featured_content',
      id: entity.field_cc_national_spotlight_1.target_id,
      field_section_header:
        entity.field_cc_national_spotlight_1.fetched.field_section_header[0]
          .value,
      field_description: {
        ...entity.field_cc_national_spotlight_1.fetched.field_description[0],
      },
      drupal_internal__id: null,
      drupal_internal__revision_id: null,
      langcode: null,
      status: true,
      field_cta: {
        type: 'paragraph--button',
        field_button_label:
          entity.field_cc_national_spotlight_1.fetched.field_cta[0]
            .field_button_label[0].value,
        field_button_link: {
          ...entity.field_cc_national_spotlight_1.fetched.field_cta[0]
            .field_button_link[0],
        },
        drupal_internal__id:
          entity.field_cc_national_spotlight_1.fetched.field_cta[0].target_id,
        drupal_internal__revision_id:
          entity.field_cc_national_spotlight_1.fetched.field_cta[0]
            .target_revision_id,
        langcode:
          entity.field_cc_national_spotlight_1.fetched.field_cta[0].langcode,
        status:
          entity.field_cc_national_spotlight_1.fetched.field_cta[0].status,
        id: null,
      },
    }),
    ...entity.field_local_spotlight.map((feature) => {
      return formatFeaturedContent(feature)
    }),
  ]

  return {
    ...entityBaseFields(entity),
    address: entity.field_address,
    ccBenefitsHotline: {
      type: PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT as PhoneContact['type'],
      label:
        entity.field_cc_benefits_hotline.fetched.field_phone_label[0]?.value ||
        null,
      number:
        entity.field_cc_benefits_hotline.fetched.field_phone_number[0]?.value ||
        null,
      extension:
        entity.field_cc_benefits_hotline.fetched.field_phone_extension[0]
          ?.value || null,
      id: entity.field_cc_benefits_hotline.target_id || null,
    },
    ccVBAFacilityOverview: {
      type: PARAGRAPH_RESOURCE_TYPES.WYSIWYG as Wysiwyg['type'],
      html: getHtmlFromField(
        entity.field_cc_vba_facility_overview.fetched.field_wysiwyg[0]
      ),
      id: entity.field_cc_vba_facility_overview.target_id || null,
    },
    featuredContent: featuredContent,
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
    image: entity.field_media ? formatImage(entity.field_media) : null,
    officeHours: entity.field_office_hours,
    operatingStatusFacility: entity.field_operating_status_facility,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
    prepareForVisit: entity.field_prepare_for_visit.map(
      (prepareForVisitItem) => {
        return formatAccordionItem(prepareForVisitItem)
      }
    ),
    phoneNumber: entity.field_phone_number,
  }
}
