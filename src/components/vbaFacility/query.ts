import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVbaFacility, NodeVbaService } from '@/types/drupal/node'
import { VbaFacility } from './formatted-type'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatImage } from '@/components/mediaImage/query'
import { formatter as formatFeaturedContent } from '@/components/featuredContent/query'
import { formatter as formatAccordionItem } from '@/components/accordion/query'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  fetchAndConcatAllResourceCollectionPages,
} from '@/lib/drupal/query'
import { PhoneContact } from '@/components/contactInfo/formatted-type'
import { formatter as formatServiceLocation } from '@/components/serviceLocation/query'

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

export const serviceParams: QueryParams<string> = (facilityId: string) => {
  return new DrupalJsonApiParams()
    .addInclude([
      'field_office',
      'field_service_name_and_descripti',
      'field_service_location',
      'field_service_location.field_service_location_address',
      'field_service_location.field_other_phone_numbers',
      'field_service_location.field_phone',
      'field_service_location.field_email_contacts',
    ])
    .addFilter('field_office.id', facilityId)
}

// Define the option types for the data loader.
export type VbaFacilityDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}
type VbaFacilityData = {
  entity: NodeVbaFacility
  services: NodeVbaService[]
}

// Implement the data loader.
export const data: QueryData<VbaFacilityDataOpts, VbaFacilityData> = async (
  opts
): Promise<VbaFacilityData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VBA_FACILITY,
    params
  )) as NodeVbaFacility
  const { data: services } =
    await fetchAndConcatAllResourceCollectionPages<NodeVbaService>(
      RESOURCE_TYPES.VBA_SERVICE,
      serviceParams(entity.id),
      PAGE_SIZES.MAX
    )

  return {
    entity,
    services,
  }
}

export const formatter: QueryFormatter<VbaFacilityData, VbaFacility> = ({
  entity,
  services,
}) => {
  const withFallbackLink = (
    content: ReturnType<typeof formatFeaturedContent>,
    originalLink: string
  ) => {
    if (!content?.link) {
      return content
    }

    return {
      ...content,
      link: {
        ...content.link,
        url: originalLink || content.link.url,
      },
    }
  }

  const featuredContent = [
    withFallbackLink(
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
            options: [],
          },
          drupal_internal__id: parseInt(
            entity.field_cc_national_spotlight_1.fetched.field_cta[0].target_id
          ),
          drupal_internal__revision_id: parseInt(
            entity.field_cc_national_spotlight_1.fetched.field_cta[0]
              .target_revision_id
          ),
          langcode:
            entity.field_cc_national_spotlight_1.fetched.field_cta[0].langcode,
          status:
            entity.field_cc_national_spotlight_1.fetched.field_cta[0].status,
          id: null,
        },
      }),
      entity.field_cc_national_spotlight_1.fetched.field_cta[0]
        .field_button_link[0].uri
    ),
    ...entity.field_local_spotlight.map((feature) => {
      return withFallbackLink(
        formatFeaturedContent(feature),
        feature.field_cta?.field_button_link?.url
      )
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
    ccCantFindBenefits: entity.field_cc_cant_find_benefits
      ? {
          header:
            entity.field_cc_cant_find_benefits?.fetched?.field_section_header[0]
              ?.value || null,
          description: getHtmlFromField(
            entity.field_cc_cant_find_benefits?.fetched?.field_description[0]
          ),
          link: {
            label:
              entity.field_cc_cant_find_benefits?.fetched?.field_cta[0]
                ?.field_button_label[0]?.value || null,
            url:
              entity.field_cc_cant_find_benefits?.fetched?.field_cta[0]
                ?.field_button_link[0]?.uri || null,
          },
        }
      : null,
    ccGetUpdates: entity.field_cc_get_updates_from_vba
      ? {
          heading:
            entity.field_cc_get_updates_from_vba.fetched.field_section_header[0]
              .value || null,
          links: entity.field_cc_get_updates_from_vba.fetched.field_links.map(
            (link) => ({
              text: link.title,
              href: link.uri,
            })
          ),
        }
      : null,
    ccVBAFacilityOverview: {
      type: PARAGRAPH_RESOURCE_TYPES.WYSIWYG as Wysiwyg['type'],
      html: getHtmlFromField(
        entity.field_cc_vba_facility_overview.fetched.field_wysiwyg[0]
      ),
      id: entity.field_cc_vba_facility_overview.target_id || null,
    },
    facilityLocatorApiId: entity.field_facility_locator_api_id,
    featuredContent: featuredContent,
    image: entity.field_media ? formatImage(entity.field_media) : null,
    officeHours: entity.field_office_hours,
    operatingStatusFacility: entity.field_operating_status_facility,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
    prepareForVisit: entity.field_prepare_for_visit.map(formatAccordionItem),
    phoneNumber: entity.field_phone_number,
    banner: {
      showBanner: entity.field_show_banner || false,
      alertType: entity.field_alert_type,
      title: entity.field_banner_title,
      body: entity.field_banner_content
        ? getHtmlFromField(entity.field_banner_content)
        : null,
      // Converting to bool like banner query does
      dismiss: entity.field_dismissible_option === 'dismiss',
    },
    allServices: services.map((service) => ({
      type: service.field_service_name_and_descripti?.field_vba_type_of_care,
      name: service.field_service_name_and_descripti?.name,
      facilityHeader:
        service.field_service_name_and_descripti?.field_facility_service_header,
      facilityDescription:
        service.field_service_name_and_descripti
          ?.field_facility_service_descripti,
      onlineSelfService: service.field_service_name_and_descripti
        ?.field_online_self_service
        ? {
            title:
              service.field_service_name_and_descripti.field_online_self_service
                .title,
            url: service.field_service_name_and_descripti
              .field_online_self_service.url,
          }
        : null,
      serviceDescription:
        service.field_service_name_and_descripti?.field_vba_service_descrip,
      serviceLocations: service.field_service_location.map((location) =>
        formatServiceLocation(location)
      ),
    })),
  }
}
