/**
 * @jest-environment node
 */

import { NodeVaForm } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

// @ts-expect-error The field_va_form_related_forms isn't hydrated in the mock data
const VaFormMock: NodeVaForm = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VaForm formatData', () => {
  test('outputs formatted data', () => {
    expect(queries.formatData('node--va_form', VaFormMock)).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
