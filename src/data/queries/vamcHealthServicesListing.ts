import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeVamcHealthServicesListing } from '@/types/drupal/node'
import { VamcHealthServicesListing } from '@/types/formatted/vamcHealthServicesListing'
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

// Define the query params for fetching node--health_services_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
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
    introText: entity.field_intro_text,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path?.alias || '',
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
    breadcrumbs,
  }
}
