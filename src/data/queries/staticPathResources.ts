import {
  QueryData,
  QueryFormatter,
  QueryOpts,
  QueryParams,
} from 'next-drupal-query'
import { JsonApiResponse, JsonApiResourceWithPath } from 'next-drupal'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { ResourceTypeType } from '@/lib/constants/resourceTypes'
import { StaticPathResourceType } from '@/types/index'
import { FieldAdministration } from '@/types/dataTypes/drupal/field_type'
import { queries } from '.'

const PAGE_SIZE = 50 as const //must be <= 50 due to JSON:API limit

// Define the query params for fetching static paths.
export const params: QueryParams<ResourceTypeType> = (
  resourceType: ResourceTypeType
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
      .addPageLimit(PAGE_SIZE)
  )
}

// Define the option types for the data loader.
type DataOpts = QueryOpts<{
  resourceType: ResourceTypeType
}>

type JsonApiResourceWithPathAndFieldAdmin = JsonApiResourceWithPath & {
  field_administration: FieldAdministration
}

// Implement the data loader.
export const data: QueryData<
  DataOpts,
  JsonApiResourceWithPathAndFieldAdmin[]
> = async (opts): Promise<JsonApiResourceWithPathAndFieldAdmin[]> => {
  // 1. Fetch first page.
  const firstPage = await drupalClient.getResourceCollection<JsonApiResponse>(
    opts.resourceType,
    {
      params: params(opts.resourceType).getQueryObject(),
      deserialize: false,
    }
  )

  // 2. Determine number of pages to fetch.
  const totalResourceCount = firstPage.meta.count
  const firstPageData = drupalClient.deserialize(
    firstPage
  ) as JsonApiResourceWithPathAndFieldAdmin[]
  const pageCount = Math.ceil(totalResourceCount / PAGE_SIZE)

  // 3. If more pages, fetch them in parallel.
  // Note: If we used JSON:API `next` links, we'd have to fetch in series.
  const subsequentPageData = await Promise.all(
    Array.from({
      length: pageCount - 1,
    }).map((_, i) => {
      const pageNum = i + 2
      return drupalClient.getResourceCollection<
        JsonApiResourceWithPathAndFieldAdmin[]
      >(opts.resourceType, {
        params: params(opts.resourceType)
          .addPageOffset((pageNum - 1) * PAGE_SIZE)
          .getQueryObject(),
      })
    })
  )

  // 4. Glue all pages together.
  return [firstPageData, ...subsequentPageData].flat()
}

export const formatter: QueryFormatter<
  JsonApiResourceWithPathAndFieldAdmin[],
  StaticPathResourceType[]
> = (resources: JsonApiResourceWithPathAndFieldAdmin[]) => {
  return resources.map((resource) => ({
    path: resource.path,
    administration: {
      id: resource.field_administration?.drupal_internal__tid || null,
      name: resource.field_administration?.name || null,
    },
  }))
}
