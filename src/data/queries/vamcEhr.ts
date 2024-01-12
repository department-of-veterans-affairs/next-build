import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { fetchAndConcatAllResourceCollectionPages } from '@/lib/drupal/query'
import { VamcEhr as DrupalVamcEhr } from '@/types/drupal/vamcEhr'
import { VamcEhrGraphQLMimic } from '@/types/formatted/vamcEhr'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'

const PAGE_SIZE = PAGE_SIZES.MAX

// Define the query params for fetching node--health_care_local_facility.
export const params: QueryParams<null> = () => {
  return queries
    .getParams()
    .addFields(RESOURCE_TYPES.VAMC_FACILITY, [
      'title',
      'field_facility_locator_api_id',
      'field_region_page',
    ])
    .addFilter('field_main_location', '1')
    .addInclude(['field_region_page'])
    .addFields(RESOURCE_TYPES.VAMC_SYSTEM, ['title', 'field_vamc_ehr_system'])
}

// Implement the data loader.
export const data: QueryData<null, DrupalVamcEhr[]> = async (): Promise<
  DrupalVamcEhr[]
> => {
  const { data } =
    await fetchAndConcatAllResourceCollectionPages<DrupalVamcEhr>(
      RESOURCE_TYPES.VAMC_FACILITY,
      params(),
      PAGE_SIZE
    )
  return data
}

export const formatter: QueryFormatter<DrupalVamcEhr[], VamcEhrGraphQLMimic> = (
  entities: DrupalVamcEhr[]
) => {
  // For now, return data formatted as it is in content-build (mimic GraphQL output).
  // In future, we should move the formatting from the preProcess in vets-website
  // into this formatter and, while it exists, into postProcess in content-build.
  // This change will require a coordinated effort so as to not break things with regard
  // to what vets-website is expecting and what is present in the generated file.
  return {
    data: {
      nodeQuery: {
        count: entities.length,
        entities: entities.map((entity) => ({
          title: entity.title,
          fieldFacilityLocatorApiId: entity.field_facility_locator_api_id,
          fieldRegionPage: {
            entity: {
              title: entity.field_region_page.title,
              fieldVamcEhrSystem:
                entity.field_region_page.field_vamc_ehr_system,
            },
          },
        })),
      },
    },
  }
}
