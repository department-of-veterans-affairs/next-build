import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcSystemPoliciesPage } from './template'
import { formatter, VamcSystemPoliciesPageData } from './query'
import mockData from './mock'
import { Menu } from '@/types/drupal/menu'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'

const mockEntity = mockData
const mockMenu: Menu = {
  items: [],
  tree: [],
}
const mockDataStructure: VamcSystemPoliciesPageData = {
  entity: mockEntity,
  menu: mockMenu,
  lovell: undefined,
}
const formattedData = formatter(mockDataStructure)

/**
 * Most of these tests are just making sure that the data is rendered correctly.
 * Pretty verbose for what they are, but it should be pretty thorough.
 */
describe('VamcSystemPoliciesPage with valid data', () => {
  test('renders VamcSystemPoliciesPage component', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(screen.queryByText(formattedData.title)).toBeInTheDocument()
  })

  test('renders intro text when provided', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(
      screen.getByText(/Find VA policies on privacy and patient rights/)
    ).toBeInTheDocument()
  })

  test('renders top of page content (national policies)', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(
      screen.getByRole('heading', { name: /Privacy and patient rights/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Family rights/i })
    ).toBeInTheDocument()
    // Use getAllByRole since there are multiple "Visitation policy" headings
    expect(
      screen.getAllByRole('heading', { name: /Visitation policy/i })
    ).toHaveLength(3)
    expect(
      screen.getByRole('link', {
        name: /Read VA's national privacy and patient rights policies/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /Read VA's national family rights policy/i,
      })
    ).toBeInTheDocument()
  })

  test('renders local visitation policy with phone numbers', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(
      screen.getByText(/Before visiting a patient at a VA facility/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Call the medical center for specific ward visiting hours/i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/Augusta VA Downtown campus:/i)).toBeInTheDocument()
    expect(screen.getByText(/Augusta VA Uptown campus:/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /Visitors will be allowed in the acute care service areas from 11 a.m. – 7 p.m./i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/Community Living Center/i)).toBeInTheDocument()

    // Test specific visiting guidelines sections
    expect(screen.getByText(/Visiting church members/i)).toBeInTheDocument()
    expect(screen.getByText(/Bringing food/i)).toBeInTheDocument()
    expect(screen.getByText(/Washing hands/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Following infection-control guidelines/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Staying home if you are ill/i)).toBeInTheDocument()
    // Multiple "Prohibited items" sections exist, use getAllByText
    expect(screen.getAllByText(/Prohibited items/i)).toHaveLength(3)
    expect(screen.getByText(/Giving privacy/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Visiting seriously ill patients/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Visiting patients in restraints/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Bringing children to visit/i)).toBeInTheDocument()
  })

  test('renders other local policies', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(
      screen.getByText(/All visitors will be screened by medical center staff/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Only visitors without symptoms will be permitted to enter/i
      )
    ).toBeInTheDocument()
  })

  test('renders general visitation policy (national)', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(
      screen.getByRole('heading', { name: /VA general visitation policy/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /The medical center respects the patient's right to make decisions/i
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Family.*is defined as a group of two or more persons/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /The hospital prohibits discrimination based on age, race, ethnicity/i
      )
    ).toBeInTheDocument()
  })

  test('renders bottom of page content (national)', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    expect(
      screen.getByRole('heading', { name: /Advance directives/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /Report patient quality of care concerns/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/When faced with difficult decisions about health care/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /Health Care Ethics Resources for Veterans/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /VA Form 10-0137.*VA Advance Directive/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /What You Should Know about Advance Directives/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Visit the Joint Commission page/i })
    ).toBeInTheDocument()
  })

  test('renders all interactive elements', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    // Check for va-on-this-page element
    expect(document.querySelector('va-on-this-page')).toBeInTheDocument()

    // Check for va-back-to-top element
    expect(document.querySelector('va-back-to-top')).toBeInTheDocument()
  })

  test('renders page structure and layout elements', () => {
    render(<VamcSystemPoliciesPage {...formattedData} />)

    // Check main structure
    expect(screen.getByRole('main')).toHaveClass(
      'va-l-detail-page',
      'va-facility-page'
    )
    expect(screen.getByRole('region')).toHaveClass('usa-content')
    expect(screen.getByRole('region')).toHaveAttribute(
      'aria-labelledby',
      'article-heading'
    )

    // Check heading structure
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      formattedData.title
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
      'id',
      'article-heading'
    )

    // Check for intro text styling
    const introElement = document.querySelector('.va-introtext')
    expect(introElement).toBeInTheDocument()

    // Check for content footer
    expect(screen.getByTestId('content-footer')).toBeInTheDocument()

    // Check for sidebar nav placeholder
    const sideNav = document.querySelector(
      'nav[aria-label="secondary"][data-widget-type="side-nav"]'
    )
    expect(sideNav).toBeInTheDocument()
  })

  test('sets up window.sideNav for navigation widget', () => {
    // Mock window.sideNav
    Object.defineProperty(window, 'sideNav', {
      writable: true,
      value: undefined,
    })

    render(<VamcSystemPoliciesPage {...formattedData} />)

    // The useEffect should have set window.sideNav
    expect(window.sideNav).toBeDefined()
    expect(window.sideNav).toEqual(formattedData.menu)
  })
})

describe('VamcSystemPoliciesPage LovellSwitcher', () => {
  test('does not render LovellSwitcher when no lovell data is provided', () => {
    const dataWithoutLovell: VamcSystemPoliciesPageData = {
      entity: mockEntity,
      menu: mockMenu,
      lovell: undefined,
    }
    const formattedDataWithoutLovell = formatter(dataWithoutLovell)

    render(<VamcSystemPoliciesPage {...formattedDataWithoutLovell} />)

    // LovellSwitcher should not render when no variant is provided
    expect(
      screen.queryByText(/You are viewing this page as a/)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/View this page as a/)).not.toBeInTheDocument()
  })

  test('renders LovellSwitcher for VA variant with TRICARE switch path', () => {
    const mockLovellContext: ExpandedStaticPropsContext['lovell'] = {
      variant: 'va',
      isLovellVariantPage: true,
    }

    const dataWithVALovell: VamcSystemPoliciesPageData = {
      entity: mockEntity,
      menu: mockMenu,
      lovell: mockLovellContext,
    }
    const formattedDataWithVALovell = formatter(dataWithVALovell)

    render(<VamcSystemPoliciesPage {...formattedDataWithVALovell} />)

    // Check that the VA variant alert is shown
    expect(
      screen.getByText('You are viewing this page as a VA beneficiary.')
    ).toBeInTheDocument()
  })
})
