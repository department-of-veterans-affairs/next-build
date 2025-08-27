import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  NodeHealthCareLocalFacility,
  NodeHealthCareRegionPage,
  NodeNewsStory,
  NodeEvent,
} from '@/types/drupal/node'
import { VamcSystem, VamcSystemSocialLinks } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import {
  entityBaseFields,
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
  getMenu,
} from '@/lib/drupal/query'
import { formatter as formatImage } from '@/components/mediaImage/query'
import { formatter as formatRelatedLinks } from '@/components/relatedLinks/query'
import { Menu } from '@/types/drupal/menu'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { queries } from '@/data/queries'
import { formatter as formatAdministration } from '@/components/administration/query'
import { formatter as formatNewsStoryTeaser } from '@/components/newsStoryTeaser/query'
import { formatter as formatEventTeaser } from '@/components/eventTeaser/query'
import { formatter as formatPhone } from '@/components/phoneNumber/query'
import {
  getLovellVariantOfUrl,
  getOppositeChildVariant,
} from '@/lib/drupal/lovell/utils'
import { getNextEventOccurrences } from '../event/query-utils'
import { LOVELL } from '@/lib/drupal/lovell/constants'

// Define the query params for fetching node--vamc_system.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_media',
    'field_media.image',
    'field_administration',
    'field_related_links',
    'field_related_links.field_va_paragraphs',
  ])
}

// Define the option types for the data loader.
export type VamcSystemDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

/**
 * The shape of the data from Drupal + `lovell` from the path context.
 * We're adding `lovell` from the context here to conditionally re-shape
 * the menu for Lovell facilities.
 */
type VamcSystemData = {
  entity: NodeHealthCareRegionPage
  menu: Menu | null
  lovell?: ExpandedStaticPropsContext['lovell']
  mainFacilities: NodeHealthCareLocalFacility[]
  featuredStories: NodeNewsStory[]
  featuredEvents: NodeEvent[]
  fallbackEvent: NodeEvent | null
}

// Implement the data loader.
export const data: QueryData<VamcSystemDataOpts, VamcSystemData> = async (
  opts
): Promise<VamcSystemData> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VAMC_SYSTEM,
    params
  )) as NodeHealthCareRegionPage

  if (!entity) {
    throw new Error(
      `NodeHealthCareRegionPage entity not found for id: ${opts.id}`
    )
  }

  const lovell = opts.context?.lovell
  const isLovellVariantPage = lovell?.isLovellVariantPage ?? false

  // Fetch list of local facilities related to this VAMC System
  const { data: mainFacilities } =
    await fetchAndConcatAllResourceCollectionPages<NodeHealthCareLocalFacility>(
      RESOURCE_TYPES.VAMC_FACILITY,
      queries
        .getParams(RESOURCE_TYPES.VAMC_FACILITY)
        .addFilter('field_region_page.id', entity.id)
        .addFilter('field_main_location', '1'),
      PAGE_SIZES[RESOURCE_TYPES.VAMC_FACILITY]
    )

  // Fetch featured stories for this VAMC System
  const featuredStories = await fetchFeaturedStories(
    entity.id,
    isLovellVariantPage
  )

  // Fetch featured events or a fallback non-featured event for this VAMC System
  const { featuredEvents, fallbackEvent } = await fetchSystemEvents(
    entity.id,
    isLovellVariantPage
  )

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    entity.field_system_menu.resourceIdObjMeta.drupal_internal__target_id
  )

  return {
    entity,
    menu,
    mainFacilities,
    featuredStories,
    featuredEvents,
    fallbackEvent,
    lovell,
  }
}

async function fetchFeaturedStories(
  systemId: string,
  isLovellVariantPage: boolean
) {
  let { data: featuredStories } =
    await fetchAndConcatAllResourceCollectionPages<NodeNewsStory>(
      RESOURCE_TYPES.STORY,
      queries
        .getParams(RESOURCE_TYPES.STORY)
        .addInclude(['field_listing'])
        .addFilter('field_listing.field_office.id', systemId)
        .addFilter('status', '1')
        .addFilter('field_featured', '1'),
      PAGE_SIZES[RESOURCE_TYPES.STORY_LISTING]
    )

  // If this is a Lovell variant page, there could be stories that are shared between this
  // variant and the other variant (Lovell bifurcated resources), so fetch those as well
  if (isLovellVariantPage) {
    const { data: parentStories } =
      await fetchAndConcatAllResourceCollectionPages<NodeNewsStory>(
        RESOURCE_TYPES.STORY,
        queries
          .getParams(RESOURCE_TYPES.STORY)
          .addInclude([
            'field_listing',
            'field_listing.field_office',
            'field_listing.field_office.field_administration',
          ])
          .addFilter(
            'field_listing.field_office.field_administration.drupal_internal__tid',
            LOVELL.federal.administration.entityId.toString()
          )
          .addFilter('status', '1')
          .addFilter('field_featured', '1'),
        PAGE_SIZES[RESOURCE_TYPES.STORY_LISTING]
      )
    featuredStories = [...featuredStories, ...parentStories]
  }

  return featuredStories
}

async function fetchSystemEvents(
  systemId: string,
  isLovellVariantPage: boolean
) {
  // Helper that will fetch all featured or non-featured events and handle Lovell logic
  const fetchAllEvents = async (featured: boolean) => {
    const entityEvents = (
      await fetchAndConcatAllResourceCollectionPages<NodeEvent>(
        RESOURCE_TYPES.EVENT,
        queries
          .getParams(RESOURCE_TYPES.EVENT)
          .addInclude(['field_listing'])
          .addFilter('field_listing.field_office.id', systemId)
          .addFilter('status', '1')
          .addFilter('field_featured', featured ? '1' : '0'),
        PAGE_SIZES[RESOURCE_TYPES.EVENT_LISTING]
      )
    ).data

    // If this is a Lovell variant page, there could be events that are shared between this
    // variant and the other variant (Lovell bifurcated resources), so fetch those as well
    if (isLovellVariantPage) {
      const parentEvents = (
        await fetchAndConcatAllResourceCollectionPages<NodeEvent>(
          RESOURCE_TYPES.EVENT,
          queries
            .getParams(RESOURCE_TYPES.EVENT)
            .addInclude([
              'field_listing',
              'field_listing.field_office',
              'field_listing.field_office.field_administration',
            ])
            .addFilter(
              'field_listing.field_office.field_administration.drupal_internal__tid',
              LOVELL.federal.administration.entityId.toString()
            )
            .addFilter('status', '1')
            .addFilter('field_featured', featured ? '1' : '0'),
          PAGE_SIZES[RESOURCE_TYPES.EVENT_LISTING]
        )
      ).data
      return [...entityEvents, ...parentEvents]
    }

    return entityEvents
  }

  // Fetch all featured, published events that are in the future
  const nowUnix = Math.floor(Date.now() / 1000)
  const featuredEvents = getNextEventOccurrences(
    await fetchAllEvents(true),
    nowUnix
  )

  // If there are none, fetch all non-featured, published events that are in the future
  let fallbackEvent: NodeEvent | null = null
  if (featuredEvents.length === 0) {
    const otherEvents = getNextEventOccurrences(
      await fetchAllEvents(false),
      nowUnix
    )
    // Take the event that is soonest in the future
    fallbackEvent = otherEvents[0] ?? null
  }

  return {
    featuredEvents,
    fallbackEvent,
  }
}

export const getVamcSystemSocialLinks = (
  // region: Pick<NodeHealthCareRegionPage, 'title' | 'field_facebook' | 'field_twitter' | 'field_flickr' | 'field_instagram' | 'field_youtube' | 'field_govdelivery_id_news' | 'field_govdelivery_id_emerg' | 'field_operating_status'> | Omit<NodeHealthCareRegionPage, 'field_media'>
  region:
    | NodeHealthCareRegionPage
    | Omit<NodeHealthCareRegionPage, 'field_media'>
): VamcSystemSocialLinks => ({
  regionNickname: region.title,
  links: [
    region.field_govdelivery_id_news && {
      icon: 'mail',
      href: `https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=${region.field_govdelivery_id_news}`,
      text: `Subscribe to ${region.title} news and announcements`,
    },
    region.field_govdelivery_id_emerg && {
      icon: 'mail',
      href: `https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=${region.field_govdelivery_id_emerg}`,
      text: `Subscribe to ${region.title} emergency notifications`,
    },
    region.field_operating_status && {
      icon: 'adjust',
      href: region.field_operating_status.url,
      text: `${region.title} operating status`,
    },
    region.field_facebook && {
      icon: 'facebook',
      href: region.field_facebook.uri,
      text: region.field_facebook.title,
    },
    region.field_twitter && {
      icon: 'x',
      href: region.field_twitter.uri,
      text: region.field_twitter.title,
    },
    region.field_flickr && {
      icon: 'flickr',
      href: region.field_flickr.uri,
      text: region.field_flickr.title,
    },
    region.field_instagram && {
      icon: 'instagram',
      href: region.field_instagram.uri,
      text: region.field_instagram.title,
    },
    region.field_youtube && {
      icon: 'youtube',
      href: region.field_youtube.uri,
      text: region.field_youtube.title,
    },
  ].filter(Boolean),
})

export const formatter: QueryFormatter<VamcSystemData, VamcSystem> = ({
  entity,
  menu,
  mainFacilities,
  featuredStories,
  featuredEvents,
  fallbackEvent,
  lovell,
}) => {
  const formattedMenu = buildSideNavDataFromMenu(entity.path.alias, menu)
  return {
    ...entityBaseFields(entity),
    title: entity.title,
    introText: entity.field_intro_text,
    image: formatImage(entity.field_media),
    administration: formatAdministration(entity.field_administration),
    path: entity.path.alias,
    menu: formattedMenu,
    mainFacilities: mainFacilities.map((facility) => ({
      title: facility.title,
      path: facility.path.alias,
      operatingStatusFacility: facility.field_operating_status_facility,
      address: facility.field_address,
      mainPhoneString: facility.field_phone_number,
      mentalHealthPhoneNumber: formatPhone(facility.field_telephone),
      vaHealthConnectPhoneNumber: entity.field_va_health_connect_phone,
      image: formatImage(facility.field_media),
    })),
    // Only show the first two featured stories
    featuredStories: featuredStories.map(formatNewsStoryTeaser),
    featuredEvents: featuredEvents.map(formatEventTeaser),
    fallbackEvent: fallbackEvent ? formatEventTeaser(fallbackEvent) : null,
    relatedLinks: formatRelatedLinks(entity),
    vamcEhrSystem: entity.field_vamc_ehr_system,
    lovellVariant: lovell?.variant ?? null,
    lovellSwitchPath: lovell?.isLovellVariantPage
      ? getLovellVariantOfUrl(
          entity.path.alias,
          getOppositeChildVariant(lovell?.variant)
        )
      : null,
    socialLinks: getVamcSystemSocialLinks(entity),
  }
}
