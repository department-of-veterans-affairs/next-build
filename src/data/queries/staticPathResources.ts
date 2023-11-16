import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { JsonApiResourceWithPath } from 'next-drupal'
import {
  ADDITIONAL_RESOURCE_TYPES,
  ResourceType,
} from '@/lib/constants/resourceTypes'
import { StaticPathResource } from '@/types/dataTypes/formatted/staticPathResource'
import { FieldAdministration } from '@/types/dataTypes/drupal/field_type'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { queries } from '.'
import { fetchAndConcatAllResourceCollectionPages } from './utils'

const PAGE_SIZE = PAGE_SIZES[ADDITIONAL_RESOURCE_TYPES.STATIC_PATHS]

// Define the query params for fetching static paths.
export const params: QueryParams<ResourceType> = (
  resourceType: ResourceType
) => {
  return (
    queries
      .getParams()
      // Note: We can't put `path` first:
      // See:
      //  https://next-drupal.org/guides/page-limit
      //  https://dsva.slack.com/archives/C01SR56755H/p1695244241079879?thread_ts=1695070010.697129&cid=C01SR56755H
      .addFields(resourceType, ['field_administration', 'title', 'path'])
      .addInclude(['field_administration'])
  )
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  resourceType: ResourceType
}>

type JsonApiResourceWithPathAndFieldAdmin = JsonApiResourceWithPath & {
  field_administration: FieldAdministration
}

// Implement the data loader.
export const data: QueryData<
  DataOpts,
  JsonApiResourceWithPathAndFieldAdmin[]
> = async (opts): Promise<JsonApiResourceWithPathAndFieldAdmin[]> => {
  const { data } =
    await fetchAndConcatAllResourceCollectionPages<JsonApiResourceWithPathAndFieldAdmin>(
      opts.resourceType,
      params(opts.resourceType),
      PAGE_SIZE
    )
  return data
}

export const formatter: QueryFormatter<
  JsonApiResourceWithPathAndFieldAdmin[],
  StaticPathResource[]
> = (resources: JsonApiResourceWithPathAndFieldAdmin[]) => {
  return resources.map((resource) => ({
    path: resource.path.alias,
    administration: {
      id: resource.field_administration?.drupal_internal__tid || null,
      name: resource.field_administration?.name || null,
    },
  }))
}
