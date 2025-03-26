import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'
import { queries } from '.'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { NodeLeadershipListing } from '@/types/drupal/node'
import { LeadershipListing } from '@/types/formatted/leadershipListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'

export type LeadershipListingData = {
  entity: NodeLeadershipListing
  menu: Menu
}

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes(
      'field_leadership',
      RESOURCE_TYPES.PERSON_PROFILE
    ),
    'field_office',
  ])
}

export type LeadershipListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

export const data: QueryData<LeadershipListingDataOpts, LeadershipListingData> = async (
  opts
) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.LEADERSHIP_LISTING,
    params
  )) as NodeLeadershipListing

  // Fetch the menu name dynamically off of the field_office reference if available.
  let menu = null

  if (entity?.field_office?.field_system_menu) {
    menu = await getMenu(
      entity.field_office.field_system_menu.resourceIdObjMeta
        .drupal_internal__target_id
    )
  }

  return { entity, menu }
}

export const formatter: QueryFormatter<LeadershipListingData, LeadershipListing> = ({
  entity,
  menu,
}) => {
  let formattedMenu = null

  if (menu !== null) {
    formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  }

  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    leadership: entity.field_leadership.map(leader => queries.formatData(RESOURCE_TYPES.PERSON_PROFILE, { entity: leader })),
    menu: formattedMenu,
    title: entity.title,
  }
}
