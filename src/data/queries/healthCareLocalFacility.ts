import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { HealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { getLovellVariantOfMenu } from '@/lib/drupal/lovell/utils'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

// Define the query params for fetching node--health_care_local_facility.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_region_page.field_related_links.field_va_paragraphs',
    'field_media',
    'field_media.image',
    'field_administration',
    'field_telephone',
  ])
}

// Define the option types for the data loader.
export type HealthCareLocalFacilityDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

/**
 * The shape of the data from Drupal + `lovell` from the path context.
 * We're adding `lovell` from the context here to conditionally re-shape
 * the menu for Lovell facilities.
 */
export type LocalFacilityData = {
  entity: NodeHealthCareLocalFacility
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  HealthCareLocalFacilityDataOpts,
  LocalFacilityData
> = async (opts) => {
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

export const formatter: QueryFormatter<
  LocalFacilityData,
  HealthCareLocalFacility
> = ({ entity, menu, lovell }) => {
  let formattedMenu =
    menu !== null ? buildSideNavDataFromMenu(entity.path.alias, menu) : null

  if (lovell?.isLovellVariantPage) {
    formattedMenu = getLovellVariantOfMenu(formattedMenu, lovell?.variant)
  }

  return {
    ...entityBaseFields(entity),
    address: entity.field_address,
    phoneNumber: entity.field_phone_number,
    vaHealthConnectPhoneNumber:
      entity.field_region_page.field_va_health_connect_phone,
    fieldTelephone: entity.field_telephone,
    introText: entity.field_intro_text,
    operatingStatusFacility: entity.field_operating_status_facility,
    menu: formattedMenu,
    path: entity.path.alias,
    administration: {
      entityId: entity.field_administration.drupal_internal__tid,
    },
    vamcEhrSystem: entity.field_region_page.field_vamc_ehr_system,
    officeHours: entity.field_office_hours,
    image: formatImage(entity.field_media),
    facilityLocatorApiId: entity.field_facility_locator_api_id,
    geoLocation: entity.field_geolocation,
    relatedLinks: {
      sectionTitle: entity.field_region_page.title
        ? `Other services at ${entity.field_region_page.title}`
        : (entity.field_region_page.field_related_links?.field_va_paragraphs
            .field_title ?? ''),
      links:
        entity.field_region_page.field_related_links?.field_va_paragraphs
          .slice(0, 8)
          // Adding the type annotation because TS doesn't apparently pick up on
          // this since we've done an Omit<> on the parent type.
          .map((linkTeaser: ParagraphLinkTeaser) => ({
            title: linkTeaser.field_link.title,
            uri: linkTeaser.field_link.url,
            // summary: ''
          })) ?? null,
    },
  }
}
