import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeLandingPage } from '@/types/drupal/node'
import { BenefitsHub } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

// Define the query params for fetching node--benefit_hub_landing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_related_office',
    'field_alert',
    'field_promo',
    'field_support_services',
    'field_related_links',
    'field_spokes',
  ])
}

// Define the option types for the data loader.
export type BenefitsHubDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<BenefitsHubDataOpts, NodeLandingPage> = async (
  opts
): Promise<NodeLandingPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.BENEFITS_HUB,
    params
  )) as NodeLandingPage

  return entity
}

export const formatter: QueryFormatter<NodeLandingPage, BenefitsHub> = (
  entity: NodeLandingPage
) => {
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    intro: entity.field_intro_text,
    hubLabel: entity.field_home_page_hub_label,
    teaserText: entity.field_teaser_text,
    titleIcon: entity.field_title_icon,
  }
}
