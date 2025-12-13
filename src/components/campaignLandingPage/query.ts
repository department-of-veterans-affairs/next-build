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
    'field_clp_events_references',
    'field_clp_events_references.field_listing',
    'field_clp_events_references.field_listing.field_office',
    'field_clp_events_references.field_media',
    'field_clp_events_references.field_media.image',
    'field_clp_events_references.field_facility_location',
    'field_clp_faq_cta',
    'field_clp_faq_paragraphs',
    'field_clp_faq_paragraphs.field_answer',
    'field_clp_reusable_q_a',
    'field_clp_reusable_q_a.field_q_as',
    'field_clp_reusable_q_a.field_q_as.field_answer',
    'field_benefit_categories',
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
        ...imageFormatter(entity.field_hero_image),

        /* Empty alt expected per requirements
         * https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22439
         */
        alt: '',
      },
    },
    cta: {
      primary:
        entity.field_primary_call_to_action?.field_button_link &&
        entity.field_primary_call_to_action.field_button_label
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
      cta:
        entity.field_clp_spotlight_cta &&
        buttonFormatter(entity.field_clp_spotlight_cta),
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
      cta: entity.field_clp_resources_cta
        ? buttonFormatter(entity.field_clp_resources_cta)
        : null,
      documents: (entity.field_clp_resources ?? []).map(
        mediaDocumentExternalFormatter
      ),
    },
    events: {
      show: entity.field_clp_events_panel,
      header: entity.field_clp_events_header,
      events: (entity.field_clp_events_references ?? [])
        .filter((e) => e.path)
        .map((event) => queries.formatData('node--event', event)),
    },
    faq: {
      show: entity.field_clp_faq_panel,
      faqs: (entity?.field_clp_faq_paragraphs ?? []).map((p) =>
        queries.formatData('paragraph--q_a', p)
      ),
      cta: entity?.field_clp_faq_cta
        ? queries.formatData('paragraph--button', entity.field_clp_faq_cta)
        : null,
      reusable: entity?.field_clp_reusable_q_a
        ? queries.formatData(
            'paragraph--q_a_group',
            entity.field_clp_reusable_q_a
          )
        : null,
    },
    connectWithUs: entity.field_connect_with_us
      ? {
          organizationTitle:
            entity.field_connect_with_us.field_external_link?.title || '',
          emailLink: entity.field_connect_with_us.field_email_updates_link
            ? {
                href:
                  entity.field_connect_with_us.field_email_updates_link.url ||
                  entity.field_connect_with_us.field_email_updates_link.uri,
                title:
                  entity.field_connect_with_us.field_email_updates_link.title,
              }
            : null,
          socialLinks: {
            twitter:
              entity.field_connect_with_us.field_social_media_links
                ?.platform_values?.twitter?.value || null,
            facebook:
              entity.field_connect_with_us.field_social_media_links
                ?.platform_values?.facebook?.value || null,
            youtube:
              entity.field_connect_with_us.field_social_media_links
                ?.platform_values?.youtube?.value || null,
            instagram:
              entity.field_connect_with_us.field_social_media_links
                ?.platform_values?.instagram?.value || null,
            linkedin:
              entity.field_connect_with_us.field_social_media_links
                ?.platform_values?.linkedin?.value || null,
          },
        }
      : null,
    benefitCategories: (entity.field_benefit_categories ?? []).map(
      (category) => ({
        title: category.title,
        path: category.path.alias,
        titleIcon: category.field_title_icon,
        teaserText: category.field_teaser_text,
      })
    ),
  }
}
