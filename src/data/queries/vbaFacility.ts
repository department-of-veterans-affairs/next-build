import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVbaFacility, NodeVbaService } from '@/types/drupal/node'
import { VbaFacility } from '@/types/formatted/vbaFacility'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { formatter as formatFeaturedContent } from '@/data/queries/featuredContent'
import { formatter as formatAccordionItem } from '@/data/queries/accordion'
import { formatter as formatPhone } from '@/data/queries/phoneNumber'
import { formatter as formatEmail } from '@/data/queries/emailContact'
import { createPhoneLinks } from '@/lib/utils/createPhoneLinks'
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
import { PhoneContact } from '@/types/formatted/contactInfo'

const isPublished = (entity: { status: boolean }) => entity.status === true

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
const getLinkType = (uri: string) => {
  const types = [
    { match: 'facebook.com', type: 'facebook' },
    { match: 'twitter.com', type: 'x' },
    { match: 'x.com', type: 'x' },
    { match: 'instagram.com', type: 'instagram' },
    { match: 'govdelivery.com', type: 'mail' },
    { match: 'flickr.com', type: 'flickr' },
    { match: 'youtube.com', type: 'youtube' },
  ]
  const found = types.find(({ match }) => uri.includes(match))
  return found ? found.type : null
}

export const formatter: QueryFormatter<VbaFacilityData, VbaFacility> = ({
  entity,
  services,
}) => {
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
              label: link.title,
              url: link.uri,
              type: getLinkType(link.uri),
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
      serviceLocations: service.field_service_location.map((location) => ({
        fieldOfficeVisits: location.field_office_visits,
        fieldVirtualSupport: location.field_virtual_support,
        fieldApptIntroTextType: location.field_appt_intro_text_type,
        fieldApptIntroTextCustom: createPhoneLinks(
          location.field_appt_intro_text_custom
        ),
        appointmentPhoneNumbers: location.field_other_phone_numbers
          .filter(isPublished)
          .map(formatPhone),
        fieldOnlineSchedulingAvail: location.field_online_scheduling_avail,
        contactInfoPhoneNumbers: location.field_phone
          .filter(isPublished)
          .map(formatPhone),
        fieldEmailContacts: location.field_email_contacts
          .filter(isPublished)
          .map(formatEmail),
        fieldHours: location.field_hours,
        fieldOfficeHours: location.field_office_hours,
        fieldAdditionalHoursInfo: location.field_additional_hours_info,
        fieldUseMainFacilityPhone: location.field_use_main_facility_phone,
        fieldUseFacilityPhoneNumber: location.field_use_facility_phone_number,
        fieldServiceLocationAddress: location.field_service_location_address,
      })),
    })),
  }
}
