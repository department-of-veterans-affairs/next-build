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
      field_listing: undefined,
      field_press_release_contact: undefined,
      field_administration: undefined,
      field_pdf_version: undefined,
    }
    const formattedData = queries.formatData(
      RESOURCE_TYPES.PRESS_RELEASE,
      modifiedMock
    )
    expect(formattedData.listing).toBeUndefined()
    expect(formattedData.contacts).toEqual([])
    expect(formattedData.administration.id).toBeNull()
    expect(formattedData.administration.name).toBeNull()
    expect(formattedData.pdfVersion).toBeNull()
  })
  test('handles missing or null contact fields correctly', () => {
    const modifiedMockContact: NodePressRelease = {
      ...nodePressReleaseMock,
      field_press_release_contact: [
        {
          ...nodePressReleaseMock.field_press_release_contact[0],
          id: undefined,
          field_description: undefined,
          title: undefined,
          field_email_address: undefined,
          field_telephone: {
            ...nodePressReleaseMock.field_press_release_contact[0]
              .field_telephone,
            id: undefined,
            field_phone_number_type: undefined,
            field_phone_number: undefined,
            field_phone_extension: undefined,
          },
        },
      ],
    }
    const formattedData = queries.formatData(
      RESOURCE_TYPES.PRESS_RELEASE,
      modifiedMockContact
    )
    expect(formattedData.contacts[0].id).toBeNull()
    expect(formattedData.contacts[0].description).toBeNull()
    expect(formattedData.contacts[0].name).toBeNull()
    expect(formattedData.contacts[0].email).toBeNull()
    expect(formattedData.contacts[0].numbers[0].id).toBeNull()
    expect(formattedData.contacts[0].numbers[0].type).toBeNull()
    expect(formattedData.contacts[0].numbers[0].number).toBeNull()
    expect(formattedData.contacts[0].numbers[0].ext).toBeNull()
  })
})

describe('DrupalJsonApiParams configuration for pressRelease', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_press_release_downloads,field_press_release_downloads.image,field_press_release_downloads.field_document,field_press_release_contact,field_press_release_contact.field_telephone,field_listing,field_administration,field_pdf_version,field_pdf_version.field_document/
    )
  })
})
