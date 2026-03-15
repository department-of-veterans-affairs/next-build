/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import mockData from './mock.json'
import { NodeCampaignLandingPage } from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'
import { params } from './query'
import { BlockPromo } from '@/types/drupal/block'

const campaignLandingPageMock = mockData as unknown as NodeCampaignLandingPage

const mockPageQuery = jest.fn(
  () => campaignLandingPageMock as unknown as NodeCampaignLandingPage
)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.CAMPAIGN_LANDING_PAGE,
  mockPageQuery
)

function runQuery() {
  return queries.getData(RESOURCE_TYPES.CAMPAIGN_LANDING_PAGE, {
    id: campaignLandingPageMock.id,
  })
}

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    expect(
      decodeURIComponent(paramsInstance.getQueryString())
    ).toMatchSnapshot()
  })
})

describe('CampaignLandingPage query', () => {
  beforeEach(() => {
    mockPageQuery.mockReturnValue(
      campaignLandingPageMock as unknown as NodeCampaignLandingPage
    )
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  test('handles null primary CTA', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_primary_call_to_action: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.cta.primary).toBeNull()
  })

  test('handles null secondary CTA', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_secondary_call_to_action: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.cta.secondary).toBeNull()
  })

  test('filters out promos with missing link or image', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_what_you_can_do_promos: [
        ...campaignLandingPageMock.field_clp_what_you_can_do_promos,
        { field_image: { image: {} } } as BlockPromo,
      ],
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()
    expect(result.whatYouCanDo.promos.length).toBe(1)

    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_what_you_can_do_promos: [
        ...campaignLandingPageMock.field_clp_what_you_can_do_promos,
        { field_promo_link: {} } as BlockPromo,
      ],
    } as unknown as NodeCampaignLandingPage)

    const resultWithoutImage = await runQuery()
    expect(resultWithoutImage.whatYouCanDo.promos.length).toBe(1)

    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_what_you_can_do_promos: [
        ...campaignLandingPageMock.field_clp_what_you_can_do_promos,
        {
          field_promo_link: {},
          field_image: { image: {} },
        } as BlockPromo,
      ],
    } as unknown as NodeCampaignLandingPage)

    const resultWithBoth = await runQuery()
    expect(resultWithBoth.whatYouCanDo.promos.length).toBe(2)
  })

  test('stories cta label is title when non-empty or else "See more stories"', async () => {
    const makeDataWithStoriesCtaTitle = (title: string | null | undefined) => {
      mockPageQuery.mockReturnValue({
        ...campaignLandingPageMock,
        field_clp_stories_cta: {
          ...campaignLandingPageMock.field_clp_stories_cta,
          title,
        },
      } as unknown as NodeCampaignLandingPage)
    }

    makeDataWithStoriesCtaTitle('specific test title')
    const withTitle = await runQuery()
    expect(withTitle.stories.cta?.label).toBe('specific test title')

    makeDataWithStoriesCtaTitle('')
    const withEmpty = await runQuery()
    expect(withEmpty.stories.cta?.label).toBe('See more stories')

    makeDataWithStoriesCtaTitle(null)
    const withNull = await runQuery()
    expect(withNull.stories.cta?.label).toBe('See more stories')

    makeDataWithStoriesCtaTitle(undefined)
    const withUndefined = await runQuery()
    expect(withUndefined.stories.cta?.label).toBe('See more stories')
  })

  test('handles null field_clp_stories_cta', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_stories_cta: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.stories.cta).toBeNull()
  })

  test('handles null field_media (video panel)', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_media: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.video.media).toBeFalsy()
  })

  test('handles null field_clp_video_panel_more_video', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_video_panel_more_video: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.video.button).toBeFalsy()
  })

  test('handles null field_clp_spotlight_cta', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_spotlight_cta: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.spotlight.cta).toBeFalsy()
  })

  test('handles null field_clp_spotlight_link_teasers', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_spotlight_link_teasers: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.spotlight.teasers).toEqual([])
  })

  test('handles null field_clp_stories_teasers', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_stories_teasers: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.stories.teasers).toEqual([])
  })

  test('handles null field_clp_resources_cta', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_resources_cta: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.resources.cta).toBeNull()
  })

  test('handles null field_clp_resources', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_resources: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.resources.documents).toEqual([])
  })

  test('handles null field_clp_events_references', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_events_references: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.events.events).toEqual([])
  })

  test('filters out events without path', async () => {
    const events = campaignLandingPageMock.field_clp_events_references ?? []
    const baseEvent = events[0] ?? {
      type: 'node--event',
      id: 'test-event',
      title: 'Test',
      path: { alias: '/test' },
    }

    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_events_references: [
        { ...baseEvent, id: 'no-path', path: null },
        { ...baseEvent, id: 'with-path', path: { alias: '/test' } },
      ],
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.events.events).toHaveLength(1)
  })

  test('handles null field_clp_faq_cta', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_faq_cta: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.faq.cta).toBeNull()
  })

  test('handles null field_clp_faq_paragraphs', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_faq_paragraphs: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.faq.faqs).toEqual([])
  })

  test('handles null field_clp_reusable_q_a', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_clp_reusable_q_a: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.faq.reusable).toBeNull()
  })

  test('handles null field_connect_with_us', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_connect_with_us: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.connectWithUs).toBeNull()
  })

  test('handles connectWithUs with null field_email_updates_link', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_connect_with_us: {
        ...campaignLandingPageMock.field_connect_with_us,
        field_email_updates_link: null,
      },
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.connectWithUs?.emailLink).toBeNull()
  })

  test('handles connectWithUs with null field_external_link', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_connect_with_us: {
        ...campaignLandingPageMock.field_connect_with_us,
        field_external_link: null,
      },
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.connectWithUs?.organizationTitle).toBe('')
  })

  test('handles connectWithUs with null field_social_media_links', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_connect_with_us: {
        ...campaignLandingPageMock.field_connect_with_us,
        field_social_media_links: null,
      },
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.connectWithUs?.socialLinks.twitter).toBeNull()
    expect(result.connectWithUs?.socialLinks.facebook).toBeNull()
  })

  test('handles null field_benefit_categories', async () => {
    mockPageQuery.mockReturnValue({
      ...campaignLandingPageMock,
      field_benefit_categories: null,
    } as unknown as NodeCampaignLandingPage)

    const result = await runQuery()

    expect(result.benefitCategories).toEqual([])
  })
})
