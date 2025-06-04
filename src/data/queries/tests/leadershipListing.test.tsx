/**
 * @jest-environment node
 */
import { NodeLeadershipListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/leadershipListing.mock.json'
import { params } from '../leadershipListing'

//eslint-disable-next-line
const leadershipListingMock: NodeLeadershipListing | any = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function includes the correct fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_leadership,field_office,field_leadership.field_media.image,field_leadership.field_telephone,field_leadership.field_office,field_administration/
    )
  })
})

describe('LeadershipListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--leadership_listing', {
        entity: leadershipListingMock,
        menu: null,
      })
    ).toMatchSnapshot()
  })
  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/about-us/leadership',
      pid: 79642,
      langcode: 'en',
    }
    const lovellBreadcrumbs = [
      {
        uri: 'https://va-gov-cms.ddev.site/',
        title: 'Home',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care',
        title: 'Lovell Federal health care',
        options: [],
      },
      {
        uri: 'internal:#',
        title: 'ABOUT LOVELL FEDERAL',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care-va/about-us',
        title: 'About us',
        options: [],
      },
      {
        uri: 'internal:#',
        title: 'Leadership',
        options: [],
      },
    ]
    test('outputs formatted data with Lovell variant', () => {
      const formattedData = queries.formatData('node--leadership_listing', {
        entity: leadershipListingMock,
        menu: null,
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare',
        },
      })
      expect(formattedData).toMatchSnapshot()
    })
    test('updates the breadcrumbs for Lovell variant', () => {
      const formattedData = queries.formatData('node--leadership_listing', {
        entity: {
          ...leadershipListingMock,
          path: lovellPath,
          breadcrumbs: lovellBreadcrumbs,
        },
        menu: null,
        lovell: {
          isLovellVariantPage: true,
          variant: 'tricare',
        },
      })
      expect(formattedData.breadcrumbs[1]).toEqual({
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care-tricare',
        title: 'Lovell Federal health care - TRICARE',
        options: [],
      })
    })
  })
})
