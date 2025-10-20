import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { VaForm } from './template'
import { VaForm as VaFormType } from './formatted-type'
import { formatter } from './query'
import mockData from './mock.json'

// Create formatted mock data using the actual formatter
// @ts-expect-error The mock data isn't fully hydrated (doesn't have all the
// child entities)
const formattedMockData = formatter(mockData)

// Create test data variations
const benefitFormMock: VaFormType = {
  ...formattedMockData,
  formType: 'benefit',
  benefitCategories: ['Disability compensation', 'Health care'],
}

const employmentFormMock: VaFormType = {
  ...formattedMockData,
  formType: 'employment',
  formName: 'Application for Employment',
  formNumber: 'SF-85',
}

const nonVaFormMock: VaFormType = {
  ...formattedMockData,
  formType: 'non-va',
  formName: 'GSA Form Example',
  formNumber: 'GSA-123',
}

const minimalFormMock: VaFormType = {
  ...formattedMockData,
  usage: null,
  toolUrl: null,
  toolIntro: null,
  linkTeasers: [],
  relatedForms: [],
}

const formWithRelatedMock: VaFormType = {
  ...formattedMockData,
  relatedForms: [
    {
      id: '1',
      formNumber: '10-10EZ',
      formName: 'Application for Health Benefits',
    },
    {
      id: '2',
      formNumber: '21-526EZ',
      formName: 'Application for Disability Compensation',
    },
  ],
}

describe('VaForm Component', () => {
  describe('Basic rendering', () => {
    test('renders form title and basic information', () => {
      render(<VaForm {...formattedMockData} />)

      expect(screen.getByText('About VA Form 21-0781')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)'
        )
      ).toBeInTheDocument()
      expect(screen.getByText(/Form revision date:/)).toBeInTheDocument()
      expect(screen.getByText('March 2024')).toBeInTheDocument()
    })

    test('displays form download information', () => {
      render(<VaForm {...formattedMockData} />)

      expect(
        screen.getByText('Download VA Form 21-0781 (PDF)')
      ).toBeInTheDocument()
      const downloadButton = screen.getByRole('button', {
        name: /Download VA Form 21-0781/,
      })
      expect(downloadButton).toHaveAttribute('data-form-number', '21-0781')
    })

    test('passes accessibility checks', async () => {
      const { container } = render(<VaForm {...formattedMockData} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Form type handling', () => {
    test('displays benefit category information for benefit forms', () => {
      render(<VaForm {...benefitFormMock} />)

      expect(screen.getByText(/Related to:/)).toBeInTheDocument()
      expect(
        screen.getByText('Disability compensation, Health care')
      ).toBeInTheDocument()
    })

    test('displays employment information for employment forms', () => {
      render(<VaForm {...employmentFormMock} />)

      expect(screen.getByText(/Related to:/)).toBeInTheDocument()
      expect(screen.getByText('Employment or jobs at VA')).toBeInTheDocument()
    })

    test('displays non-VA form information with GSA link', () => {
      render(<VaForm {...nonVaFormMock} />)

      expect(screen.getByText(/Related to:/)).toBeInTheDocument()
      expect(screen.getByText(/A non-VA form/)).toBeInTheDocument()
      const gsaLink = screen.getByRole('link', { name: 'GSA forms library' })
      expect(gsaLink).toHaveAttribute(
        'href',
        'https://www.gsa.gov/reference/forms'
      )
    })

    test('falls back to administration for benefit forms without categories', () => {
      const formWithAdministration = {
        ...benefitFormMock,
        benefitCategories: undefined,
        administration: 'Veterans Health Administration',
      }
      render(<VaForm {...formWithAdministration} />)

      expect(
        screen.getByText('Veterans Health Administration')
      ).toBeInTheDocument()
    })
  })

  describe('Usage section', () => {
    test('displays usage information when present', () => {
      render(<VaForm {...formattedMockData} />)

      expect(screen.getByText('When to use this form')).toBeInTheDocument()
      expect(
        screen.getByText(/Use VA Form 21-0781 if you've been diagnosed/)
      ).toBeInTheDocument()
    })

    test('displays correct heading when no usage information', () => {
      render(<VaForm {...minimalFormMock} />)

      expect(screen.getByText('Downloadable PDF')).toBeInTheDocument()
      expect(
        screen.queryByText('When to use this form')
      ).not.toBeInTheDocument()
    })
  })

  describe('Online tool section', () => {
    test('displays online tool information when available', () => {
      render(<VaForm {...formattedMockData} />)

      expect(screen.getByText('Online tool')).toBeInTheDocument()
      expect(
        screen.getByText(/We'll ask you to complete an online application/)
      ).toBeInTheDocument()
      const toolLink = screen.getByRole('generic', {
        name: /Go to the online tool/,
      })
      expect(toolLink).toBeInTheDocument()
    })

    test('hides online tool section when not available', () => {
      render(<VaForm {...minimalFormMock} />)

      expect(screen.queryByText('Online tool')).not.toBeInTheDocument()
    })
  })

  describe('Related forms section', () => {
    test('displays related forms when present', () => {
      render(<VaForm {...formWithRelatedMock} />)

      expect(
        screen.getByText('Related forms and instructions')
      ).toBeInTheDocument()
      expect(screen.getByText('VA Form 10-10EZ')).toBeInTheDocument()
      expect(
        screen.getByText('Application for Health Benefits')
      ).toBeInTheDocument()
      expect(screen.getByText('VA Form 21-526EZ')).toBeInTheDocument()
      expect(
        screen.getByText('Application for Disability Compensation')
      ).toBeInTheDocument()
    })

    test('hides related forms section when none present', () => {
      render(<VaForm {...minimalFormMock} />)

      expect(
        screen.queryByText('Related forms and instructions')
      ).not.toBeInTheDocument()
    })

    test('creates correct links for related forms', () => {
      render(<VaForm {...formWithRelatedMock} />)

      const form1Link = screen.getByRole('link', { name: 'VA Form 10-10EZ' })
      expect(form1Link).toHaveAttribute(
        'href',
        '/find-forms/about-form-10-10ez'
      )

      const form2Link = screen.getByRole('link', { name: 'VA Form 21-526EZ' })
      expect(form2Link).toHaveAttribute(
        'href',
        '/find-forms/about-form-21-526ez'
      )
    })
  })

  describe('Helpful links section', () => {
    test('displays custom helpful links when present', () => {
      render(<VaForm {...formattedMockData} />)

      expect(
        screen.getByText('Helpful links related to VA Form 21-0781')
      ).toBeInTheDocument()
      expect(
        screen.getByText('How to file a VA disability claim')
      ).toBeInTheDocument()
      expect(
        screen.getByText('How to apply for VA health care')
      ).toBeInTheDocument()
      expect(screen.getByText('VA mental health services')).toBeInTheDocument()
      expect(screen.getByText('PTSD treatment')).toBeInTheDocument()
    })

    test('displays default helpful links when custom links not present', () => {
      render(<VaForm {...minimalFormMock} />)

      expect(screen.getByText('Helpful links')).toBeInTheDocument()
      expect(
        screen.getByText('Change your direct deposit information')
      ).toBeInTheDocument()
      expect(screen.getByText('Change your address')).toBeInTheDocument()
      expect(
        screen.getByText('Request your military records, including DD214')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Get your VA records and documents online')
      ).toBeInTheDocument()
    })

    test('creates correct links for helpful resources', () => {
      render(<VaForm {...formattedMockData} />)

      // Check that va-link components have correct href attributes
      // Note: va-link is a web component, so we check for the custom element
      const vaLinks = screen.getAllByRole('generic')
      const disabilityLink = vaLinks.find(
        (link) =>
          link.getAttribute('text') === 'How to file a VA disability claim'
      )
      expect(disabilityLink).toHaveAttribute(
        'href',
        '/disability/how-to-file-claim'
      )
    })
  })

  describe('Date formatting', () => {
    test('formats revision date correctly', () => {
      const formWithDate = {
        ...formattedMockData,
        revisionDate: '2023-12-15',
        issueDate: undefined,
      }
      render(<VaForm {...formWithDate} />)

      expect(screen.getByText('December 2023')).toBeInTheDocument()
    })

    test('uses issue date when revision date not available', () => {
      const formWithIssueDate = {
        ...formattedMockData,
        revisionDate: undefined,
        issueDate: '2023-06-10',
      }
      render(<VaForm {...formWithIssueDate} />)

      expect(screen.getByText('June 2023')).toBeInTheDocument()
    })
  })
})
