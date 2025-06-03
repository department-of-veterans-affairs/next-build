import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeLeadershipListing } from '@/types/drupal/node'
import { LeadershipListing } from '@/types/formatted/leadershipListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { queries } from '.'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { Menu } from '@/types/drupal/menu'

// Define the query params for fetching node--leadership_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_leadership',
    'field_office',
    'field_leadership.field_media.image',
    'field_leadership.field_telephone',
  ])
}

// Define the option types for the data loader.
export type LeadershipListingDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

export type LeadershipListingData = {
  entity: NodeLeadershipListing
  menu: Menu | null
}

// Implement the data loader.
export const data: QueryData<
  LeadershipListingDataOpts,
  LeadershipListingData
> = async (opts) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.LEADERSHIP_LISTING,
    params
  )) as NodeLeadershipListing

  const menu = entity.field_office
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          .drupal_internal__target_id
      )
    : null

  return { entity, menu }
}

export const formatter: QueryFormatter<
  LeadershipListingData,
  LeadershipListing
> = ({ entity, menu }) => {
  const formattedMenu =
    menu !== null ? buildSideNavDataFromMenu(entity.path.alias, menu) : null
  const formattedProfiles = entity.field_leadership.map((profile) => {
    return {
      firstName: profile.field_name_first,
      lastName: profile.field_last_name,
      vamcTitle: profile.field_office?.title || '',
      description: profile.field_description || '',
      suffix: profile.field_suffix || '',
      phoneNumber: queries.formatData(
        'paragraph--phone_number',
        profile.field_telephone
      ),
      media: queries.formatData('media--image', profile.field_media),
      link: profile.path.alias,
      id: profile.id,
    }
  })
  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    profiles: formattedProfiles,
    menu: formattedMenu,
  }
}
