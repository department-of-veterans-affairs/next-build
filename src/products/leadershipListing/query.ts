import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeLeadershipListing } from '@/types/drupal/node'
import { LeadershipListing } from '@/products/leadershipListing/formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { formatter as formatImage } from '@/data/queries/mediaImage'
import { formatter as formatPhone } from '@/data/queries/phoneNumber'
import { formatter as formatAdministration } from '@/data/queries/administration'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
  getLovellVariantOfBreadcrumbs,
} from '@/lib/drupal/lovell/utils'

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
    'field_leadership.field_office',
    'field_administration',
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
  lovell?: ExpandedStaticPropsContext['lovell']
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

  return { entity, menu, lovell: opts.context?.lovell }
}

export const formatter: QueryFormatter<
  LeadershipListingData,
  LeadershipListing
> = ({ entity, menu, lovell }) => {
  let { breadcrumbs } = entity
  if (lovell?.isLovellVariantPage) {
    breadcrumbs = getLovellVariantOfBreadcrumbs(breadcrumbs, lovell.variant)
  }
  const formattedMenu =
    menu !== null ? buildSideNavDataFromMenu(entity.path.alias, menu) : null
  const formattedProfiles = entity.field_leadership
    .filter((profile) => profile.status === true)
    .map((profile) => {
      const formattedLink = () => {
        if (!profile.path?.alias || !profile.field_complete_biography_create) {
          return ''
        }
        if (lovell?.isLovellVariantPage) {
          return getLovellVariantOfUrl(profile.path.alias, lovell.variant)
        }
        return profile.path.alias
      }
      return {
        firstName: profile.field_name_first || '',
        lastName: profile.field_last_name || '',
        vamcTitle: profile.field_office?.title || '',
        description: profile.field_description || '',
        suffix: profile.field_suffix || '',
        phoneNumber: formatPhone(profile.field_telephone),
        media: formatImage(profile.field_media),
        link: formattedLink(),
        id: profile.id,
      }
    })
  return {
    ...entityBaseFields(entity),
    breadcrumbs,
    introText: entity.field_intro_text,
    profiles: formattedProfiles,
    menu: formattedMenu,
    administration: formatAdministration(entity.field_administration),
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
  }
}
