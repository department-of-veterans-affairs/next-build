/**
 * @jest-environment node
 */

import { NodeVaForm } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import { params, formatter } from './query'
import mockData from './mock.json'

// @ts-expect-error The field_va_form_related_forms isn't fully hydrated in the mock data
const VaFormMock: NodeVaForm = mockData

describe('VaForm formatter', () => {
  test('outputs formatted data with all fields', () => {
    expect(formatter(VaFormMock)).toMatchSnapshot()
  })

  test('handles minimal form data', () => {
    const minimalForm: NodeVaForm = {
      ...VaFormMock,
      field_va_form_usage: undefined,
      field_va_form_tool_url: undefined,
      field_va_form_tool_intro: undefined,
      field_va_form_link_teasers: [],
      field_va_form_related_forms: [],
    }

    const formatted = formatter(minimalForm)

    // Null because of JSON serialization
    expect(formatted.usage).toEqual('')
    expect(formatted.toolUrl).toBeNull()
    expect(formatted.toolIntro).toBeNull()
    expect(formatted.linkTeasers).toEqual([])
    expect(formatted.relatedForms).toEqual([])
  })

  test('properly formats different form types', () => {
    const employmentForm: NodeVaForm = {
      ...VaFormMock,
      field_va_form_type: 'employment',
    }

    const nonVaForm: NodeVaForm = {
      ...VaFormMock,
      field_va_form_type: 'non-va',
    }

    expect(formatter(employmentForm).formType).toBe('employment')
    expect(formatter(nonVaForm).formType).toBe('non-va')
  })

  test('handles related forms correctly', () => {
    const formWithRelated: NodeVaForm = {
      ...VaFormMock,
      field_va_form_related_forms: [
        {
          ...VaFormMock,
          id: 'related-1',
          field_va_form_number: '10-10EZ',
          field_va_form_name: 'Application for Health Benefits',
        } as NodeVaForm,
      ],
    }

    const formatted = formatter(formWithRelated)

    expect(formatted.relatedForms).toHaveLength(1)
    expect(formatted.relatedForms?.[0]).toEqual({
      id: 'related-1',
      formNumber: '10-10EZ',
      formName: 'Application for Health Benefits',
    })
  })
})
