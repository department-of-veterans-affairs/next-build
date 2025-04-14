import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { JsonApiResourceWithPath } from 'next-drupal'
import { ResourceType } from '@/lib/constants/resourceTypes'
import { StaticPathResource } from '@/types/formatted/staticPathResource'
import { FieldAdministration } from '@/types/drupal/field_type'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { fetchAndConcatAllResourceCollectionPages } from '@/lib/drupal/query'

const PAGE_SIZE = PAGE_SIZES.MAX

// Define the query params for fetching static paths.
export const params: QueryParams<ResourceType> = (
  resourceType: ResourceType
) => {
  const params = new DrupalJsonApiParams()
    // Note: We can't put `path` first:
    // See:
    //  https://next-drupal.org/guides/page-limit
    //  https://dsva.slack.com/archives/C01SR56755H/p1695244241079879?thread_ts=1695070010.697129&cid=C01SR56755H
    .addFields(resourceType, ['field_administration', 'title', 'path'])
    .addInclude(['field_administration'])
  // Filter out profiles that shouldn't have a page.
  if (resourceType === 'node--person_profile') {
    params.addFilter('field_complete_biography_create', '1')
  }

  return params
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
  // Filter out resources that don't have a path or path alias
  const filteredResources = resources.filter((resource) =>
    Boolean(resource.path?.alias)
  )
  return filteredResources.map((filteredResource) => ({
    path: filteredResource.path.alias,
    administration: {
      id: filteredResource.field_administration?.drupal_internal__tid || null,
      name: filteredResource.field_administration?.name || null,
    },
  }))
}
