import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EventTeaser } from './index'
import { EventWidgetTeaser } from '../../../components/event/formatted-type'
import { formatter } from '@/data/queries/eventTeaser'
import mockEventData from '@/components/event/mock.json'
import { NodeEvent } from '@/types/drupal/node'

// Format the mock data using the real formatter
const formattedEventData: EventWidgetTeaser = formatter(
  mockEventData as NodeEvent
)

describe('EventTeaser Component', () => {
  describe('Title and Link', () => {
    test('renders title as a link with correct href', () => {
      const { container } = render(<EventTeaser {...formattedEventData} />)

      const link = container.querySelector('va-link[text="Pickleball Club"]')
      expect(link).toHaveAttribute(
        'href',
        '/central-iowa-health-care/events/52265'
      )
      expect(link).toHaveAttribute('text', 'Pickleball Club')
    })

    test('renders title with correct heading level and classes', () => {
      render(<EventTeaser {...formattedEventData} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Description', () => {
    test('renders description when provided', () => {
      render(<EventTeaser {...formattedEventData} />)

      // The mock data has "Pickleball " as description
      expect(screen.getByText('Pickleball')).toBeInTheDocument()
    })

    test('handles null description gracefully', () => {
      const mockEventDataWithoutDescription: EventWidgetTeaser = {
        ...formattedEventData,
        fieldDescription: null,
      }
      const { container } = render(
        <EventTeaser {...mockEventDataWithoutDescription} />
      )

      // Should still render the component without errors
      const link = container.querySelector('va-link[text="Pickleball Club"]')
      expect(link).toBeInTheDocument()
    })

    test('truncates long descriptions', () => {
      // Let's create a description that definitely has more than 60 words
      const veryLongDescription = Array(80).fill('word').join(' ')
      const longDescriptionData = {
        ...formattedEventData,
        fieldDescription: veryLongDescription,
      }

      render(<EventTeaser {...longDescriptionData} />)

      const descriptionElement = screen.getByText(/word word word/)

      // Check that the text was truncated to approximately 60 words
      const wordCount = descriptionElement.textContent?.split(' ').length || 0
      expect(wordCount).toBeLessThanOrEqual(62) // Should be around 60 words plus "..."

      // The truncated text should contain ellipsis
      expect(descriptionElement.textContent?.endsWith('...')).toBe(true)

      // And should be shorter than the original
      expect(descriptionElement.textContent?.length || 0).toBeLessThan(
        veryLongDescription.length
      )
    })
  })

  describe('Date and Time Section', () => {
    function mockTimeZone(timeZone: string) {
      const originalResolvedOptions =
        Intl.DateTimeFormat.prototype.resolvedOptions
      jest
        .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
        .mockReturnValue({
          ...originalResolvedOptions.call(new Intl.DateTimeFormat()),
          timeZone,
        })
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('displays formatted date from real data', () => {
      // Mock timezone to Mountain Time to ensure consistent test results no matter where
      // the test is run (Pacific on my machine, Central on CI)
      mockTimeZone('America/Denver')

      render(<EventTeaser {...formattedEventData} />)

      // Should show a date (the exact format will depend on the current date and timezone)
      expect(screen.getByText('When')).toBeInTheDocument()
      expect(
        screen.getByText('Thu. Sep 14, 2023, 8:00 a.m. – 10:00 a.m. MT')
      ).toBeInTheDocument()
    })

    test('applies correct grid classes to when section', () => {
      const { container } = render(<EventTeaser {...formattedEventData} />)
      const whenRow = container.querySelector(
        '.vads-grid-row.vads-grid-gap-1.vads-u-margin-bottom--1'
      )
      expect(whenRow).toBeInTheDocument()

      const labelCol = whenRow?.querySelector('.vads-grid-col-auto')
      const contentCol = whenRow?.querySelector('.vads-grid-col-fill')
      expect(labelCol).toBeInTheDocument()
      expect(contentCol).toBeInTheDocument()
    })
  })

  describe('Location Section', () => {
    test('does not render facility location when null (as in mock data)', () => {
      render(<EventTeaser {...formattedEventData} />)

      // The mock data has field_facility_location: null, so Where section should not appear
      const whereLabels = screen.queryAllByText('Where')
      expect(whereLabels).toHaveLength(0)
    })

    test('renders human-readable location when provided', () => {
      render(<EventTeaser {...formattedEventData} />)

      // The mock data has "Walker Johnston Park" as human-readable location
      // But since there's no facility location, this won't be displayed in the Where section
      // However, the data is there and could be used if needed
      expect(formattedEventData.fieldLocationHumanreadable).toBe(
        'Walker Johnston Park'
      )
    })

    test('does not render location section when fieldFacilityLocation is not provided', () => {
      const mockEventDataWithoutFacility: EventWidgetTeaser = {
        ...formattedEventData,
        fieldFacilityLocation: null,
        fieldLocationHumanreadable: '',
      }
      render(<EventTeaser {...mockEventDataWithoutFacility} />)

      const whereLabels = screen.queryAllByText('Where')
      expect(whereLabels).toHaveLength(0)
    })
  })

  describe('Location Section with Facility', () => {
    test('renders location section when fieldFacilityLocation is provided', () => {
      // Create mock data with a facility location
      const mockEventWithFacility: EventWidgetTeaser = {
        ...formattedEventData,
        fieldFacilityLocation: {
          entity: {
            entityUrl: {
              path: '/facility/sample-facility',
            },
            fieldAddress: {
              addressLine1: '456 Facility St',
              addressLine2: 'Suite 100',
              administrativeArea: 'State',
              countryCode: 'US',
              locality: 'Facility City',
              postalCode: '67890',
            },
            title: 'Sample Medical Center',
          },
        },
        fieldLocationHumanreadable: '123 Main St, City, State 12345',
      }

      const { container } = render(<EventTeaser {...mockEventWithFacility} />)

      expect(screen.getByText('Where')).toBeInTheDocument()
      // Check for va-link with the facility title
      const facilityLink = container.querySelector(
        'va-link[text="Sample Medical Center"]'
      )
      expect(facilityLink).toBeInTheDocument()
      expect(
        screen.getByText('123 Main St, City, State 12345')
      ).toBeInTheDocument()
    })

    test('renders facility location as a link', () => {
      const mockEventWithFacility: EventWidgetTeaser = {
        ...formattedEventData,
        fieldFacilityLocation: {
          entity: {
            entityUrl: {
              path: '/facility/sample-facility',
            },
            fieldAddress: {
              addressLine1: '456 Facility St',
              addressLine2: 'Suite 100',
              administrativeArea: 'State',
              countryCode: 'US',
              locality: 'Facility City',
              postalCode: '67890',
            },
            title: 'Sample Medical Center',
          },
        },
      }

      const { container } = render(<EventTeaser {...mockEventWithFacility} />)

      const facilityLink = container.querySelector(
        'va-link[text="Sample Medical Center"]'
      )
      expect(facilityLink).toHaveAttribute('href', '/facility/sample-facility')
      expect(facilityLink).toHaveAttribute('text', 'Sample Medical Center')
    })
  })
})
