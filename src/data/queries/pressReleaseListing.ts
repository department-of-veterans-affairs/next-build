import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { queries } from '.'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePressRelease, NodePressReleaseListing } from '@/types/drupal/node'
import { Menu } from '@/types/drupal/menu'
import { PressReleaseListing } from '@/types/formatted/pressReleaseListing'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import {
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleResourceCollectionPage,
  entityBaseFields,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'

const PAGE_SIZE = PAGE_SIZES[RESOURCE_TYPES.PRESS_RELEASE_LISTING]

// Define the query params for fetching node--press_releases_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_office'])
}

export const listingParams: QueryParams<string> = (listingEntityId: string) => {
  return queries
    .getParams(`${RESOURCE_TYPES.PRESS_RELEASE}--teaser`)
    .addFilter('field_listing.id', listingEntityId)
    .addSort('-created')
}

// Define the option types for the data loader.
type PressReleaseListingData = {
  entity: NodePressReleaseListing
  releases: NodePressRelease[]
  menu: Menu
  totalItems: number
  totalPages: number
  current: number
  lovell?: ExpandedStaticPropsContext['lovell']
}

// Implement the data loader.
export const data: QueryData<
  ListingPageDataOpts,
  PressReleaseListingData
> = async (opts) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.PRESS_RELEASE_LISTING,
    params
  )) as NodePressReleaseListing

  // Fetch list of releases related to this listing
  const {
    data: releases,
    totalItems,
    totalPages,
  } = opts.page
    ? await fetchSingleResourceCollectionPage<NodePressRelease>(
        RESOURCE_TYPES.PRESS_RELEASE,
        listingParams(entity.id),
        PAGE_SIZE,
        opts.page
      )
    : await fetchAndConcatAllResourceCollectionPages<NodePressRelease>(
        RESOURCE_TYPES.PRESS_RELEASE,
        listingParams(entity.id),
        PAGE_SIZE
      )

  // Fetch the menu name dynamically off of the field_office reference
  const menu = entity.field_office.field_system_menu
    ? await getMenu(
        entity.field_office.field_system_menu.resourceIdObjMeta
          ?.drupal_internal__target_id
      )
    : null

  return {
    entity,
    releases,
    menu,
    totalItems,
    totalPages: totalPages,
    current: opts?.page,
    lovell: opts.context?.lovell,
  }
}

export const formatter: QueryFormatter<
  PressReleaseListingData,
  PressReleaseListing
> = ({ entity, releases, menu, totalItems, totalPages, current, lovell }) => {
  const formattedReleases = releases.map((release) => {
    return queries.formatData(
      `${RESOURCE_TYPES.PRESS_RELEASE}--teaser`,
      release
    )
  })

  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)

  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text,
    'news-releases': formattedReleases,
    menu: formattedMenu,
    currentPage: current,
    totalItems,
    totalPages,
  }
}
