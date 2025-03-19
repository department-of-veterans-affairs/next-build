import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'
import { queries } from '.'
import { NodeLeadershipListing } from '@/types/drupal/node'
import { LeadershipListing } from '@/types/formatted/leadershipListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    // ...getNestedIncludes('field_leadership', RESOURCE_TYPES.PERSON_PROFILE),
  ])
}

// Define the option types for the data loader.
export type LeadershipListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<LeadershipListingDataOpts, NodeLeadershipListing> = async (
  opts
): Promise<NodeLeadershipListing> => {
const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.LEADERSHIP_LISTING,
    params
  )) as NodeLeadershipListing

  return entity
}

export const formatter: QueryFormatter<NodeLeadershipListing, LeadershipListing> = (
  entity: NodeLeadershipListing
) => {
  return {
    ...entityBaseFields(entity),
    description: entity.field_description,
    introText: entity.field_intro_text,
    lastSaved: entity.field_last_saved_by_an_editor,
    leadership: entity.field_leadership,
    // leadership: entity.field_leadership.map(leader => queries.formatData(RESOURCE_TYPES.PERSON_PROFILE, leader)),
    title: entity.title,
  }
}
