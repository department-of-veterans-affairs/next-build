/**
 * @jest-environment node
 */

import { NodePressRelease } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/pressRelease.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../pressRelease'

const nodePressReleaseMock: NodePressRelease = {
  ...mockData,
  field_pdf_version: {
    ...mockData.field_pdf_version,
    drupal_internal__mid:
      mockData.field_pdf_version.drupal_internal__mid.toString(),
    drupal_internal__vid:
      mockData.field_pdf_version.drupal_internal__vid.toString(),
  },
}

describe(`${RESOURCE_TYPES.PRESS_RELEASE} formatData`, () => {
  test('output formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.PRESS_RELEASE, nodePressReleaseMock)
    ).toMatchSnapshot()
  })
  test('handles missing or null fields correctly', () => {
    const modifiedMock = {
      ...nodePressReleaseMock,
      field_administration: undefined,
    }
    const formattedData = queries.formatData(
      RESOURCE_TYPES.PRESS_RELEASE,
      modifiedMock
    )
    expect(formattedData.administration.id).toBeNull()
    expect(formattedData.administration.name).toBeNull()
  })
})

describe('DrupalJsonApiParams configuration for pressRelease', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_press_release_downloads,field_press_release_downloads.image,field_press_release_downloads.field_document,field_press_release_contact,field_listing,field_administration,field_pdf_version,field_pdf_version.field_document/
    )
  })
})
