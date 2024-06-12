import { NodePressRelease } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/pressRelease.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params, formatter } from '../pressReleaseTeaser'
import { de } from '@faker-js/faker'

const nodePressReleaseTeaserMock: NodePressRelease = {
  ...mockData,
  field_pdf_version: {
    ...mockData.field_pdf_version,
    drupal_internal__mid: mockData.field_pdf_version.drupal_internal__mid.toString(),
    drupal_internal__vid: mockData.field_pdf_version.drupal_internal__vid.toString(),
  },
};

describe(`${RESOURCE_TYPES.PRESS_RELEASE}Teaser formatData`, () => {
  test('outputs formatted data', () => {
    const formattedData = formatter(nodePressReleaseTeaserMock)
    expect(formattedData).toMatchSnapshot()
  })
  test('handles missing or null fields correctly', () => {
    const modifiedMock = {
      ...nodePressReleaseTeaserMock,
    }

    const formattedData = formatter(modifiedMock)
    expect(formattedData.link).toBe(modifiedMock.path.alias)
  })
})

describe('DrupalJsonApiParams configuration for pressReleaseTeaser', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_listing/
    )
  })
})
