/**
 * @jest-environment node
 */

import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/contactInformation/mock.json'
import benefitsHubMock from '@/components/benefitsHub/mock.json'
import { params } from './query'

const ContactInfoMock = mockData as ParagraphContactInformation

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_additional_contact/)
  })
})

describe('ContactInformation formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--contact_information', ContactInfoMock)
    ).toMatchSnapshot()
  })

  test('formats benefitHubContacts from field_benefit_hub_contacts', () => {
    const entityWithBenefitHub = {
      ...ContactInfoMock,
      field_benefit_hub_contacts: benefitsHubMock,
    } as ParagraphContactInformation

    const result = queries.formatData(
      'paragraph--contact_information',
      entityWithBenefitHub
    )

    expect(result.benefitHubContacts).not.toBeNull()
    expect(result.benefitHubContacts).toBeInstanceOf(Array)
    expect(result.benefitHubContacts!.length).toBeGreaterThan(0)
    expect(result.benefitHubContacts![0]).toMatchObject({
      label: expect.any(String),
      number: expect.any(String),
      href: expect.any(String),
    })
  })
})
