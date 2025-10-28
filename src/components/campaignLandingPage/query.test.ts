/**
 * @jest-environment node
 */

import { NodeCampaignLandingPage } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

const campaignLandingPageMock = mockData as unknown as NodeCampaignLandingPage

import { CampaignLandingPage as FormattedCampaignLandingPage } from './formatted-type'

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('CampaignLandingPage formatData', () => {
  let data: FormattedCampaignLandingPage | undefined

  beforeEach(() => {
    data = queries.formatData(
      'node--campaign_landing_page',
      campaignLandingPageMock
    )
  })

  test('outputs formatted data', () => {
    expect(data).toMatchSnapshot()
  })

  test('has null breadcrumb (hidden)', () => {
    expect(data.breadcrumbs).toBe(null)
  })

  test('outputs correct hero info', () => {
    expect(data.hero.blurb).toBe(
      'This page will help answer your questions about the PACT Act and what it means for survivors.'
    )
    expect(data.hero.image.links.large.href).toBe(
      'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/styles/large/public/2021-03/Listening-Session-Website-Graphic-730x370.jpg'
    )
  })

  test('outputs correct cta links', () => {
    expect(data.cta.primary.href).toBe(
      'https://www.va.gov/disability/file-disability-claim-form-21-526ez/'
    )
    expect(data.cta.primary.label).toBe('File a disability claim online')

    expect(data.cta.secondary.href).toBe(
      '/resources/support-for-common-logingov-and-idme-issues'
    )
    expect(data.cta.secondary.label).toBe('Get support for common issues')
  })

  test('outputs correct why-this-matters', () => {
    expect(data.whyThisMatters).toBe('Example why it matters')
  })

  test('outputs audiences', () => {
    expect(data.audience.length).toBe(1)
    expect(data.audience[0].name).toBe('All Veterans')
  })

  test('outputs social links', () => {
    expect(data.socialLinks.length).toBe(2)

    const [fb, x] = data.socialLinks

    expect(fb.icon).toBe('facebook')
    expect(fb.href).toBe(
      `https://www.facebook.com/sharer/sharer.php?href=${process.env.SITE_URL}/initiatives/pact-act-and-survivors`
    )
    expect(fb.text).toBe('Share on Facebook')

    expect(x.icon).toBe('x')
    expect(x.href).toBe(
      `https://twitter.com/intent/tweet?text=PACT Act and survivors&url=${process.env.SITE_URL}/initiatives/pact-act-and-survivors`
    )
    expect(x.text).toBe('Share on X (formerly Twitter)')
  })
})
