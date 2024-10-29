/**
 * @jest-environment node
 */

import { NodeChecklist } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/checklist.mock.json'
import { params } from '../checklist';

const ChecklistMock: NodeChecklist = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())

    const expectedIncludes = [
      'field_alert_single',
      'field_buttons',
      'field_checklist.field_checklist_sections',
      'field_contact_information',
      'field_related_benefit_hubs',
      'field_related_information',
      'field_tags'
    ]

    expectedIncludes.forEach((include) => {
      expect(queryString).toMatch(new RegExp(`include=.*${include}`))
    })
  })
})

describe('Checklist formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--checklist',
        ChecklistMock
      )
    ).toMatchSnapshot()
  })

  test('handles absence of optional fields gracefully', () => {
    const modifiedMock = {
      ...ChecklistMock,
      field_alert_single: null,
      field_buttons: [],
      field_contact_information: null,
      field_related_benefit_hubs: [],
      field_related_information: [],
      field_tags: null,
    }
    const formattedData = queries.formatData(
      'node--checklist',
      modifiedMock
    )

    expect(formattedData.alert).toBeNull()
    expect(formattedData.benefitsHubLinks).toEqual([])
    expect(formattedData.buttons).toEqual([])
    expect(formattedData.contactInformation).toBeNull()
    expect(formattedData.relatedInformation).toEqual([])
    expect(formattedData.tags).toBeNull()
  })
})
