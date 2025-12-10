import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { VetCenter } from './template'
import { mockData } from './mock.formatted'

describe('VetCenter with valid data', () => {
  test('renders VetCenter component', async () => {
    const { container } = render(<VetCenter {...mockData} />)
    const imgEl = container.querySelectorAll('img')
    expect(imgEl).toBeTruthy()
    expect(screen.queryByText(/Test introText/)).toBeInTheDocument()
    expect(screen.queryByText(/1010 Delafield Road/)).toBeInTheDocument()
    expect(screen.queryByText(/In the spotlight/)).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('renders schema.org structured data scripts correctly', () => {
    const { container } = render(<VetCenter {...mockData} />)

    // Get all script tags with type="application/ld+json"
    const scriptTags = container.querySelectorAll(
      'script[type="application/ld+json"]'
    )

    // Should have at least 2 script tags (main place data + health services)
    expect(scriptTags.length).toBeGreaterThan(1)

    // Extract and parse the JSON from each script tag
    const scriptContents = Array.from(scriptTags).map((script) => {
      return JSON.parse((script as HTMLScriptElement).innerHTML)
    })

    // Take snapshot of the structured data to ensure consistency
    expect(scriptContents).toMatchSnapshot()
  })

  describe('Also called functionality', () => {
    test('renders "Also called" text when officialName is different from title', () => {
      const dataWithDifferentOfficialName = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: 'Pittsburgh Veterans Center for Readjustment',
      }

      render(<VetCenter {...dataWithDifferentOfficialName} />)

      // Should render the "Also called" text
      expect(
        screen.getByText(
          'Also called the Pittsburgh Veterans Center for Readjustment'
        )
      ).toBeInTheDocument()

      // Should have the h1 with aria-describedby pointing to the "Also called" element
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveAttribute('aria-describedby', 'vet-center-title')

      // Should have the correct ID on the "Also called" paragraph
      const alsoCalledElement = screen.getByText(
        'Also called the Pittsburgh Veterans Center for Readjustment'
      )
      expect(alsoCalledElement).toHaveAttribute('id', 'vet-center-title')
    })

    test('does not render "Also called" text when officialName is same as title', () => {
      const dataWithSameNames = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: 'Pittsburgh Vet Center',
      }

      render(<VetCenter {...dataWithSameNames} />)

      // Should not render the "Also called" text
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()

      // h1 should not have aria-describedby attribute
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).not.toHaveAttribute('aria-describedby')
    })

    test('does not render "Also called" text when officialName is null', () => {
      const dataWithNullOfficialName = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: null,
      }

      render(<VetCenter {...dataWithNullOfficialName} />)

      // Should not render the "Also called" text
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()

      // h1 should not have aria-describedby attribute
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).not.toHaveAttribute('aria-describedby')
    })

    test('does not render "Also called" text when officialName is empty string', () => {
      const dataWithEmptyOfficialName = {
        ...mockData,
        title: 'Pittsburgh Vet Center',
        officialName: '',
      }

      render(<VetCenter {...dataWithEmptyOfficialName} />)

      // Should not render the "Also called" text
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()

      // h1 should not have aria-describedby attribute
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).not.toHaveAttribute('aria-describedby')
    })

    test('does not render "Also called" when title is null but officialName exists', () => {
      const dataWithNullTitle = {
        ...mockData,
        title: null,
        officialName: 'Pittsburgh Veterans Center for Readjustment',
      }

      render(<VetCenter {...dataWithNullTitle} />)

      // Should not render the "Also called" text when title is null
      expect(screen.queryByText(/Also called the/)).not.toBeInTheDocument()
    })
  })

  test('renders ExpandableOperatingStatus when operating status is provided', () => {
    const testDataWithOperatingStatus = {
      ...mockData,
      operatingStatusFacility: 'limited' as const,
      operatingStatusMoreInfo: 'Limited hours due to maintenance',
    }

    const { container } = render(<VetCenter {...testDataWithOperatingStatus} />)

    expect(container.querySelector('va-alert-expandable')).toBeInTheDocument()
    expect(
      screen.getByText('Limited hours due to maintenance')
    ).toBeInTheDocument()
  })

  test('renders phone number with standardized PhoneNumber component', () => {
    render(<VetCenter {...mockData} />)

    // Check that the phone number is displayed with "Main phone" label
    expect(screen.getByText(/Main phone:/)).toBeInTheDocument()

    // Check that the phone number is rendered using the va-telephone component
    const phoneElement = screen.getByTestId('phone')
    expect(phoneElement).toBeInTheDocument()

    // Check that the va-telephone component is present
    const vaTelephoneElement = document.querySelector('va-telephone')
    expect(vaTelephoneElement).toBeInTheDocument()

    // Verify the contact attribute contains the phone number without dashes
    expect(vaTelephoneElement?.getAttribute('contact')).toBe('1234567890')
  })

  test('renders feedback button in ContentFooter component', () => {
    const { container } = render(<VetCenter {...mockData} />)

    // Check that the feedback button is present from the va-button component
    expect(
      container.querySelector('va-button[id="mdFormButton"]')
    ).toBeInTheDocument()
  })

  describe('Mission Explainer functionality', () => {
    test('renders mission explainer when data is present', () => {
      render(<VetCenter {...mockData} />)

      // Check that the mission explainer va-summary-box is rendered
      const summaryBox = document.querySelector('va-summary-box')
      expect(summaryBox).toBeInTheDocument()

      // Check that the heading is rendered correctly
      expect(screen.getByText('Our commitment')).toBeInTheDocument()

      // Check that the body content is rendered
      expect(
        screen.getByText(/We offer a range of services/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/talk therapy to recreational activities/)
      ).toBeInTheDocument()
    })

    test('does not render mission explainer when data is missing', () => {
      const dataWithoutMissionExplainer = {
        ...mockData,
        missionExplainer: null,
      }

      render(<VetCenter {...dataWithoutMissionExplainer} />)

      // Check that the mission explainer va-summary-box is not rendered
      const summaryBox = document.querySelector('va-summary-box')
      expect(summaryBox).not.toBeInTheDocument()
    })
  })
})
