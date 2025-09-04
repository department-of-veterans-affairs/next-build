import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { VamcHealthServicesListing } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
  getLovellVariantOfBreadcrumbs,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatAdministration } from '@/components/administration/query'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { Menu } from '@/types/drupal/menu'
import { queries } from '@/lib/drupal/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

// Define the query params for fetching node--health_services_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addInclude([
      'field_administration',
      'field_office',
      'field_featured_content_healthser',
    ])
    .addFields('node--health_care_region_page', [
      'field_vamc_ehr_system',
      'field_system_menu',
    ])
    .addFields('paragraph--link_teaser', ['field_link', 'field_link_summary'])
}

// Define the option types for the data loader.
export type VamcHealthServicesListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type VamcHealthServicesListingData = {
  entity: NodeVamcHealthServicesListing
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  VamcHealthServicesListingDataOpts,
  VamcHealthServicesListingData
> = async (opts): Promise<VamcHealthServicesListingData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING,
    params
  )) as NodeVamcHealthServicesListing
  const menu = entity.field_office?.field_system_menu
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          .drupal_internal__target_id
      )
    : null

  return {
    entity,
    menu,
    lovell: opts.context?.lovell,
  }
}

export const formatter: QueryFormatter<
  VamcHealthServicesListingData,
  VamcHealthServicesListing
> = ({ entity, menu, lovell }) => {
  let { breadcrumbs } = entity
  if (lovell?.isLovellVariantPage) {
    breadcrumbs = getLovellVariantOfBreadcrumbs(breadcrumbs, lovell.variant)
  }

  const formattedMenu =
    menu !== null
      ? buildSideNavDataFromMenu(entity.path?.alias || '', menu)
      : null

  return {
    ...entityBaseFields(entity),
    title: entity.title,
    introText: entity.field_intro_text,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path?.alias || '',
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
    breadcrumbs,
    path: entity.path?.alias || null,
    administration: formatAdministration(entity.field_administration),
    vamcEhrSystem: entity.field_office?.field_vamc_ehr_system || null,
    menu: formattedMenu,
    featuredContent:
      entity.field_featured_content_healthser?.map((item) => {
        const formattedItem = queries.formatData(
          PARAGRAPH_RESOURCE_TYPES.LINK_TEASER,
          item
        )

        // to accomodate undefined values that cause serialization issues
        // AND preserve the URL preference logic
        return {
          ...formattedItem,
          entityId: formattedItem.entityId || null,
          parentField: formattedItem.parentField || '',
          uri: item.field_link?.url || formattedItem.uri,
        }
      }) || [],
  }
}
