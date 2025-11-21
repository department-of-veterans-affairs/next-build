import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { VamcFacility } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatImage } from '@/components/mediaImage/query'
import { formatter as formatPhone } from '@/components/phoneNumber/query'
import { getHtmlFromField } from '@/lib/utils/getHtmlFromField'
import { formatter as formatAdministration } from '@/components/administration/query'
import { getVamcSystemSocialLinks } from '../vamcSystem/query'
import { formatter as formatServiceLocation } from '@/components/serviceLocation/query'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'

const isPublished = (entity: { status: boolean }) => entity.status === true

// Define the query params for fetching node--health_care_local_facility.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_region_page.field_related_links.field_va_paragraphs',
    'field_media',
    'field_media.image',
    'field_administration',
    'field_telephone',
    'field_location_services',
    'field_local_health_care_service_.field_regional_health_service.field_service_name_and_descripti',
    'field_local_health_care_service_.field_administration',
    'field_local_health_care_service_.field_service_location.field_phone',
    'field_local_health_care_service_.field_service_location.field_other_phone_numbers',
    'field_local_health_care_service_.field_service_location.field_service_location_address',
    'field_local_health_care_service_.field_service_location.field_email_contacts',
  ])
}

// Define the option types for the data loader.
export type VamcFacilityDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

/**
 * The shape of the data from Drupal + `lovell` from the path context.
 * We're adding `lovell` from the context here to conditionally re-shape
 * the menu for Lovell facilities.
 */
export type VamcFacilityData = {
  entity: NodeHealthCareLocalFacility
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<VamcFacilityDataOpts, VamcFacilityData> = async (
  opts
) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_FACILITY,
    params
  )) as NodeHealthCareLocalFacility

  // TODO: Check the data, don't just do a type assertion

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = entity.field_region_page
    ? await getMenu(
        entity.field_region_page.field_system_menu.resourceIdObjMeta
          .drupal_internal__target_id
      )
    : null

  return { entity, menu, lovell: opts.context?.lovell }
}

export const formatter: QueryFormatter<VamcFacilityData, VamcFacility> = ({
  entity,
  menu,
  lovell,
}) => {
  const formattedMenu =
    menu !== null ? buildSideNavDataFromMenu(entity.path.alias, menu) : null

  // Sort the health care services by name
  entity.field_local_health_care_service_.sort((a, b) => {
    const nameA =
      a.field_regional_health_service?.field_service_name_and_descripti?.name
    const nameB =
      b.field_regional_health_service?.field_service_name_and_descripti?.name

    if (nameA === undefined && nameB === undefined) return 0
    if (nameA === undefined) return 1 // a goes after b
    if (nameB === undefined) return -1 // a goes before b

    return nameA.localeCompare(nameB)
  })

  const formattedFacilityData: VamcFacility = {
    ...entityBaseFields(entity, lovell),
    address: entity.field_address,
    mainPhoneString: entity.field_phone_number,
    vaHealthConnectPhoneNumber:
      entity.field_region_page.field_va_health_connect_phone,
    mentalHealthPhoneNumber: formatPhone(entity.field_telephone),
    introText: entity.field_intro_text,
    operatingStatusFacility: entity.field_operating_status_facility,
    menu: formattedMenu,
    path: entity.path.alias,
    administration: formatAdministration(entity.field_administration),
    vamcEhrSystem: entity.field_region_page.field_vamc_ehr_system,
    officeHours: entity.field_office_hours,
    image: formatImage(entity.field_media),
    facilityLocatorApiId: entity.field_facility_locator_api_id,
    geoLocation: entity.field_geolocation,
    relatedLinks: formatListOfLinkTeasers(
      entity.field_region_page.field_related_links
    ),
    locationServices: entity.field_location_services.map((service) => ({
      title: service.field_title,
      wysiwigContents: getHtmlFromField(service.field_wysiwyg),
    })),
    socialLinks: getVamcSystemSocialLinks(entity.field_region_page),
    lovellVariant: lovell?.variant,
    lovellSwitchPath:
      entity.field_main_location && lovell?.variant
        ? getLovellVariantOfUrl(
            entity.path.alias,
            getOppositeChildVariant(lovell?.variant)
          )
        : null,
    vamcSystemTitle: entity.field_region_page.title,
    healthServices: entity.field_local_health_care_service_
      // Make sure we're only dealing with published health services. If they're
      // not published, they'll be entity references with no actual data.
      .filter(isPublished)
      // Make sure the service taxonomy exists. It's unclear why it wouldn't
      // exist, but...it's a problem that can happen.
      .filter(
        (healthService) =>
          healthService.field_regional_health_service
            ?.field_service_name_and_descripti
      )
      .map((healthService) => {
        const serviceTaxonomy =
          healthService.field_regional_health_service
            .field_service_name_and_descripti

        return {
          name: serviceTaxonomy?.name ?? '',
          fieldAlsoKnownAs: serviceTaxonomy?.field_also_known_as ?? '',
          fieldCommonlyTreatedCondition:
            serviceTaxonomy?.field_commonly_treated_condition ?? '',
          fieldReferralRequired: healthService.field_referral_required,
          fieldTricareDescription:
            serviceTaxonomy?.field_tricare_description ?? null,
          // If it's TRICARE, use the TRICARE description. Otherwise, use the
          // regular description.
          description:
            healthService.field_administration.name === 'Lovell - TRICARE' && // Is this the best way to check?
            serviceTaxonomy?.field_tricare_description
              ? serviceTaxonomy?.field_tricare_description
              : (getHtmlFromField(serviceTaxonomy?.description) ?? null),
          entityId: serviceTaxonomy.id,
          entityBundle: healthService.type.split('--')[1],
          fieldBody: getHtmlFromField(
            healthService.field_regional_health_service.field_body
          ),
          isMentalHealthService: serviceTaxonomy.name
            .toLowerCase()
            .includes('mental health'),
          locations: healthService.field_service_location.map(
            formatServiceLocation
          ),
          fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
          fieldHealthServiceApiId: serviceTaxonomy.field_health_service_api_id,
        }
      }),
  }
  return formattedFacilityData
}
