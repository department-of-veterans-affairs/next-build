/**
 * @jest-environment node
 */

import { NodePressRelease } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/pressRelease.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../pressRelease'

const nodePressReleaseMock: NodePressRelease = mockData;

describe(`${RESOURCE_TYPES.PRESS_RELEASE} formatData`, () => {
  test('output formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.PRESS_RELEASE, nodePressReleaseMock)
    ).toMatchSnapshot()
  })
  test('handles missing or null fields correctly', () => {
    const modifiedMock = {
      ...nodePressReleaseMock,
      field_press_release_contact: null,
      field_press_release_downloads: null,
    }

    const formattedData = queries.formatData(
      RESOURCE_TYPES.PRESS_RELEASE,
      modifiedMock
    )
    expect(formattedData.contacts).toBeNull()
    expect(formattedData.downloads).toBeNull()
  })
})

describe('DrupalJsonApiParams configuration for pressRelease', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_press_release_contact,field_press_release_downloads/
    )
  })
})
