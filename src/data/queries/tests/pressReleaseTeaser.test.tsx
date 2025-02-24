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
    drupal_internal__mid:
      mockData.field_pdf_version.drupal_internal__mid.toString(),
    drupal_internal__vid:
      mockData.field_pdf_version.drupal_internal__vid.toString(),
  },
}

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

  // Unit test just for lastUpdated field to ensure it's set correctly
  test('sets lastUpdated field correctly', () => {
    const withReleaseDate = {
      ...nodePressReleaseTeaserMock,
      field_release_date: '2024-03-20T10:00:00Z',
      created: '2024-03-15T10:00:00Z',
    }
    expect(formatter(withReleaseDate).releaseDate).toBe('2024-03-20T10:00:00Z')

    const withoutReleaseDate = {
      ...nodePressReleaseTeaserMock,
      field_release_date: null,
      created: '2024-03-15T10:00:00Z',
    }
    expect(formatter(withoutReleaseDate).releaseDate).toBe(
      '2024-03-15T10:00:00Z'
    )

    const releaseDataUndefined = {
      ...nodePressReleaseTeaserMock,
      field_release_date: undefined,
      created: '2024-03-15T10:00:00Z',
    }
    expect(formatter(releaseDataUndefined).releaseDate).toBe(
      '2024-03-15T10:00:00Z'
    )
  })
})

describe('DrupalJsonApiParams configuration for pressReleaseTeaser', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_listing/)
  })
})
