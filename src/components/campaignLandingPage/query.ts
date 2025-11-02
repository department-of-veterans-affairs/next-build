import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { NodeCampaignLandingPage } from '@/types/drupal/node'
import { CampaignLandingPage } from './formatted-type'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { getFacebookLink, getXLink } from '@/lib/utils/social'
import {
  entityBaseFields,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { formatter as formatImage } from '@/components/mediaImage/query'
import { queries } from '@/lib/drupal/queries'

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

  return {
    ...entityBaseFields(entity),
    breadcrumbs: null, // hide breadcrumb on the page
    hero: {
      blurb: entity.field_hero_blurb,
      image: {
        ...formatImage(entity.field_hero_image),

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
          image: block.field_image && formatImage(block.field_image),
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
        queries.formatData(
          'paragraph--button',
          entity.field_clp_video_panel_more_video
        ),
    },
  }
}
