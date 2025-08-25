import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { VamcHealthServicesListing } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
  getLovellVariantOfBreadcrumbs,
} from '@/lib/drupal/lovell/utils'
import { formatter as formatAdministration } from '@/data/queries/administration'

// Define the query params for fetching node--health_services_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    .addInclude(['field_administration', 'field_office'])
    .addFields('node--health_care_region_page', ['field_vamc_ehr_system'])
}

// Define the option types for the data loader.
export type VamcHealthServicesListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

type VamcHealthServicesListingData = {
  entity: NodeVamcHealthServicesListing
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

  return {
    entity,
    lovell: opts.context?.lovell,
  }
}

export const formatter: QueryFormatter<
  VamcHealthServicesListingData,
  VamcHealthServicesListing
> = ({ entity, lovell }) => {
  let { breadcrumbs } = entity
  if (lovell?.isLovellVariantPage) {
    breadcrumbs = getLovellVariantOfBreadcrumbs(breadcrumbs, lovell.variant)
  }

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
  }
}
