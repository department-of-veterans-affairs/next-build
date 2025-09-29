/**
 * @jest-environment node
 */

import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/contactInfo/mock.json'
import { params } from './query'

const ContactInfoMock = mockData as ParagraphContactInformation

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_additional_contact/)
  })
})

describe('ContactInfo formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--contact_information', ContactInfoMock)
    ).toMatchSnapshot()
  })
})
