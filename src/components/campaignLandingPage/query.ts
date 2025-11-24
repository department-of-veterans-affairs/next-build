import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeCampaignLandingPage } from '@/types/drupal/node'
import { CampaignLandingPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { getFacebookLink, getXLink } from '@/lib/utils/social'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { queries } from '@/lib/drupal/queries'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'

import { formatter as imageFormatter } from '@/components/mediaImage/query'
import { formatter as teaserWithImageFormatter } from '../linkTeaserWithImage/query'
import { formatter as buttonFormatter } from '../button/query'
import { formatter as mediaDocumentExternalFormatter } from '../mediaDocumentExternal/query'

// Define the query params for fetching node--campaign_landing_page.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_primary_call_to_action',
    'field_secondary_call_to_action',
    'field_hero_image',
    'field_hero_image.image',
    'field_clp_audience',
    'field_connect_with_us',
    'field_clp_what_you_can_do_promos',
    'field_clp_what_you_can_do_promos.field_promo_link',
    'field_clp_what_you_can_do_promos.field_image',
    'field_clp_what_you_can_do_promos.field_image.image',
    'field_media',
    'field_clp_video_panel_more_video',
    'field_clp_spotlight_cta',
    'field_clp_spotlight_link_teasers',
    'field_clp_stories_teasers',
    'field_clp_stories_teasers.field_link_teaser',
    'field_clp_stories_teasers.field_media',
    'field_clp_stories_teasers.field_media.image',
    'field_clp_resources_cta',
    'field_clp_resources',
    'field_clp_resources.thumbnail',
  ])
}

// Define the option types for the data loader.
export type CampaignLandingPageDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  CampaignLandingPageDataOpts,
  NodeCampaignLandingPage
> = async (opts): Promise<NodeCampaignLandingPage> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.CAMPAIGN_LANDING_PAGE,
    params
  )) as NodeCampaignLandingPage

  return entity
}

export const formatter: QueryFormatter<
  NodeCampaignLandingPage,
  CampaignLandingPage
> = (entity: NodeCampaignLandingPage) => {
  const host = process.env.SITE_URL || 'https://www.va.gov/'
  const pageUrl = new URL(entity.path.alias, host).href

  console.log('#'.repeat(300), entity.id)

  return {
    ...entityBaseFields(entity),
    breadcrumbs: null, // hide breadcrumb on the page
    hero: {
      blurb: entity.field_hero_blurb,
      image: {
        ...imageFormatter(entity.field_hero_image),

        /* Empty alt expected per requirements
         * https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22439
         */
        alt: '',
      },
    },
    cta: {
      primary: entity.field_primary_call_to_action
        ? {
            href: entity.field_primary_call_to_action.field_button_link.url,
            label: entity.field_primary_call_to_action.field_button_label,
          }
        : null,
      secondary: entity.field_secondary_call_to_action
        ? {
            href: entity.field_secondary_call_to_action.field_button_link.url,
            label: entity.field_secondary_call_to_action.field_button_label,
          }
        : null,
    },
    whyThisMatters: entity.field_clp_why_this_matters,
    audience: entity.field_clp_audience.map((audience) => ({
      name: audience.name,
    })),
    socialLinks: [getFacebookLink(pageUrl), getXLink(pageUrl, entity.title)],
    whatYouCanDo: {
      header: entity.field_clp_what_you_can_do_header,
      intro: entity.field_clp_what_you_can_do_intro,
      promos: entity.field_clp_what_you_can_do_promos
        // promos
        .filter((p) => p.field_promo_link && p.field_image)
        .map((block) => ({
          image: block.field_image && imageFormatter(block.field_image),
          link: block.field_promo_link,
        })),
    },
    video: {
      show: entity.field_clp_video_panel,
      header: entity.field_clp_video_panel_header,
      media:
        entity.field_media &&
        queries.formatData('media--video', entity.field_media),
      button:
        entity.field_clp_video_panel_more_video &&
        buttonFormatter(entity.field_clp_video_panel_more_video),
    },
    spotlight: {
      show: entity.field_clp_spotlight_panel,
      header: entity.field_clp_spotlight_header,
      intro: entity.field_clp_spotlight_intro_text,
      cta: buttonFormatter(entity.field_clp_spotlight_cta),
      teasers: (entity.field_clp_spotlight_link_teasers ?? []).map((teaser) =>
        queries.formatData('paragraph--link_teaser', teaser)
      ),
    },
    stories: {
      show: entity.field_clp_stories_panel,
      header: entity.field_clp_stories_header,
      intro: entity.field_clp_stories_intro,
      cta: entity.field_clp_stories_cta && {
        url: entity.field_clp_stories_cta.url,
        label: entity.field_clp_stories_cta.title || 'See more stories',
      },
      teasers: (entity.field_clp_stories_teasers ?? []).map((teaser) =>
        teaserWithImageFormatter(teaser)
      ),
    },
    resources: {
      show: entity.field_clp_resources_panel,
      header: entity.field_clp_resources_header,
      intro: entity.field_clp_resources_intro_text,
      cta: buttonFormatter(entity.field_clp_resources_cta),
      documents: (entity.field_clp_resources ?? []).map(
        mediaDocumentExternalFormatter
      ),
    },
  }
}
