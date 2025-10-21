import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeBenefitsDetailPage } from '@/types/drupal/node'
import { BenefitsDetailPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--benefits_detail_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
    // uncomment to add referenced entity data to the response
    // .addInclude([
    //  'field_media',
    //  'field_media.image',
    //  'field_administration',
    // ])
}

// Define the option types for the data loader.
export type BenefitsDetailPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<BenefitsDetailPageDataOpts, NodeBenefitsDetailPage> = async (
  opts
): Promise<NodeBenefitsDetailPage> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.BENEFITS_DETAIL_PAGE,
    params
  )) as NodeBenefitsDetailPage

  return entity
}

export const formatter: QueryFormatter<NodeBenefitsDetailPage, BenefitsDetailPage> = (
  entity: NodeBenefitsDetailPage
) => {
  return {
    ...entityBaseFields(entity)
  }
}
