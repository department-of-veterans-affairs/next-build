/**
 * @jest-environment node
 */

import { NodeVaForm } from '@/types/drupal/node'
import { formatter } from './query'
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
          metatag: [],
          field_va_form_number: '10-10EZ',
          title: 'Application for Health Benefits',
          field_va_form_name: 'Application for Health Benefits',
        } as NodeVaForm,
      ],
    }

    const formatted = formatter(formWithRelated)

    expect(formatted.relatedForms).toHaveLength(1)
    expect(formatted.relatedForms?.[0]).toEqual({
      type: 'node--va_form',
      id: 'related-1',
      entityId: 6022,
      entityPath: '/find-forms/about-form-21-0781',
      breadcrumbs: [
        {
          label: 'Home',
          href: '/',
          options: [],
        },
        {
          label: 'Find a VA Form',
          href: '/find-forms',
          options: [],
        },
        {
          label: 'Application for Health Benefits',
          href: '',
          options: [],
        },
      ],
      lastUpdated: '2025-06-13T18:24:11+00:00',
      moderationState: 'published',
      published: true,
      title: 'Application for Health Benefits',
      formNumber: '10-10EZ',
      formName: 'Application for Health Benefits',
      usage: formatted.usage, // Again, same string
      formUrl: {
        uri: 'http://www.vba.va.gov/pubs/forms/VBA-21-0781-ARE.pdf',
        title: null,
        options: [],
        url: 'http://www.vba.va.gov/pubs/forms/VBA-21-0781-ARE.pdf',
      },
      formLanguage: 'en',
      metatags: [],
    })
  })
})
