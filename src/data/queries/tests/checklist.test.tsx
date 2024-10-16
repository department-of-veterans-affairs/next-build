/**
 * @jest-environment node
 */

import { Checklist } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/checklist.mock.json'
import { params } from '../checklist';

const ChecklistMock: Checklist = mockData

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
})
