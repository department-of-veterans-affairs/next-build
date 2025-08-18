/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/vbaFacility.mock.json'
import mockServicesData from '@/mocks/vbaFacilityService.mock.json'
import { params } from '../vbaFacility'

const VbaFacilityMock = { entity: mockData, services: [mockServicesData] }

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_media,field_media.image,field_prepare_for_visit,field_local_spotlight,field_local_spotlight.field_cta/
    )
  })
})

describe('VbaFacility formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vba_facility', VbaFacilityMock)
    ).toMatchSnapshot()
  })

  test('formats social link types', () => {
    const allSocialLinkMock = {
      ...VbaFacilityMock,
      entity: {
        ...VbaFacilityMock.entity,
        field_cc_get_updates_from_vba: {
          fetched: {
            field_section_header: [{ value: 'Get updates from VBA' }],
            field_links: [
              {
                title: 'Facebook',
                uri: 'https://www.facebook.com/veteransbenefits',
              },
              {
                title: 'Twitter',
                uri: 'https://twitter.com/VeteransBenefits',
              },
              {
                title: 'X',
                uri: 'https://x.com/VeteransBenefits',
              },
              {
                title: 'Instagram',
                uri: 'https://instagram.com/VeteransBenefits',
              },
              {
                title: 'Mailing List',
                uri: 'https://www.govdelivery.com/veteransbenefits',
              },
              {
                title: 'Flickr',
                uri: 'https://www.flickr.com/photos/veteransbenefits',
              },
              {
                title: 'YouTube',
                uri: 'https://www.youtube.com/veteransbenefits',
              },
            ],
          },
        },
      },
    }
    const formattedData = queries.formatData(
      'node--vba_facility',
      allSocialLinkMock
    )
    expect(formattedData.ccGetUpdates.links).toEqual([
      {
        label: 'Facebook',
        url: 'https://www.facebook.com/veteransbenefits',
        type: 'facebook',
      },
      {
        label: 'Twitter',
        url: 'https://twitter.com/VeteransBenefits',
        type: 'x',
      },
      { label: 'X', url: 'https://x.com/VeteransBenefits', type: 'x' },
      {
        label: 'Instagram',
        url: 'https://instagram.com/VeteransBenefits',
        type: 'instagram',
      },
      {
        label: 'Mailing List',
        url: 'https://www.govdelivery.com/veteransbenefits',
        type: 'mail',
      },
      {
        label: 'Flickr',
        url: 'https://www.flickr.com/photos/veteransbenefits',
        type: 'flickr',
      },
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/veteransbenefits',
        type: 'youtube',
      },
    ])
  })
})
