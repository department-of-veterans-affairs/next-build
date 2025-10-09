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
import { getNestedIncludes } from '@/lib/utils/queries'
import { formatter as formatListOfLinkTeasers } from '@/components/listOfLinkTeasers/query'

// Define the query params for fetching node--landing_page for benefits hub.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_spokes',
    'field_spokes.field_va_paragraphs',
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
  // Only return field_spokes if it's the correct type (ParagraphListOfLinkTeasers)
  const fieldSpokes = Array.isArray(entity.field_spokes)
    ? entity.field_spokes.filter(
        (spoke) => spoke.type === 'paragraph--list_of_link_teasers'
      )
    : []

  return {
    ...entityBaseFields(entity),
    title: entity.title,
    fieldIntroText: entity.field_intro_text,
    hubLabel: entity.field_home_page_hub_label,
    teaserText: entity.field_teaser_text,
    titleIcon: entity.field_title_icon,
    fieldSpokes: fieldSpokes,
  }
}
