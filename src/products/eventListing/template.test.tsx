import React from 'react'
import { render, screen } from '@testing-library/react'
import { EventListing } from './template'
import { mockResponse } from '@/products/eventListing/mock.js'
import { formatter } from '@/products/eventListing/query'
import { EventWidgetTeaser } from '../event/formatted-type'

declare global {
  interface Window {
    allEventTeasers?: {
      entities: EventWidgetTeaser[]
    }
  }
}

describe('EventListing with valid data', () => {
  const resource = formatter({
    entity: mockResponse,
    events: [],
    menu: { items: [], tree: [] },
    totalItems: 0,
    totalPages: 1,
  })
  test('renders EventListing component', () => {
    render(<EventListing {...resource} />)

    expect(screen.queryByText(/Events/)).toBeInTheDocument()
  })
  describe('lovell variant handling', () => {
    beforeEach(() => {
      // Reset window properties before each test
      delete window.allEventTeasers
      jest.clearAllMocks()
    })
    const baseEvents = [
      {
        changed: '2025-01-07T16:59:47+00:00',
        entityBundle: 'node--event',
        entityId: 'd6593609-8836-4ee6-9c6b-4645a179839e',
        entityPublished: true,
        entityUrl: {
          path: '/lovell-federal-health-care-va/events/76044',
        },
        fieldAdditionalInformationAbo: null,
        fieldAdditionalListings: null,
        fieldAddress: {
          addressLine1: null,
          addressLine2: null,
          administrativeArea: null,
          countryCode: 'US',
          locality: null,
          postalCode: null,
        },
        fieldAdministration: {
          entity: {
            entityId: 1,
          },
        },
        fieldBody: {
          value: '<p>test body</p>',
          format: 'rich_text',
          processed: '<p>test body</p>',
        },
        fieldCtaEmail: null,
        fieldDatetimeRangeTimezone: [
          {
            value: '2045-08-14T18:00:00+00:00',
            end_value: '2045-08-14T19:00:00+00:00',
            duration: 60,
            rrule: null,
            rrule_index: null,
            timezone: 'America/Chicago',
            startTime: '2045-08-14T18:00:00+00:00',
            endTime: '2045-08-14T19:00:00+00:00',
            endValue: '2045-08-14T19:00:00+00:00',
          },
        ],
        fieldDescription:
          'Patient Tele-Town-Hall in August 2025 for Lovell FHCC.',
        fieldEventCost: 'Free',
        fieldEventCta: null,
        fieldEventRegistrationrequired: false,
        fieldFacilityLocation: null,
        fieldFeatured: false,
        fieldHowToSignUp: null,
        fieldLink: null,
        fieldListing: {
          entity: {
            entityId: 'b203a4db-a492-40ae-90dc-acdf33746cbd',
          },
        },
        fieldLocationHumanreadable: null,
        fieldLocationType: 'online',
        fieldOrder: null,
        fieldUrlOfAnOnlineEvent: null,
        title: 'Patient Tele-Town Hall',
        link: '/lovell-federal-health-care-tricare/events/76044',
      },
    ]
    it('transforms event URLs with getLovellVariantOfUrl when lovellVariant is provided', () => {
      render(
        <EventListing
          {...resource}
          events={baseEvents}
          lovellVariant="tricare"
          totalItems={1}
          totalPages={1}
        />
      )

      // The window.allEventTeasers should have events with transformed URLs
      expect(window.allEventTeasers.entities[0].entityUrl.path).toBe(
        '/lovell-federal-health-care-tricare/events/76044'
      )
    })
    it('does not transform event URLs when lovellVariant is not provided', () => {
      const modEvents = [...baseEvents]
      modEvents[0].entityUrl.path = '/boston-health-care/events/76044'
      render(
        <EventListing
          {...resource}
          events={baseEvents}
          totalItems={1}
          totalPages={1}
        />
      )
      // The window.allEventTeasers should have events with transformed URLs
      expect(window.allEventTeasers.entities[0].entityUrl.path).toBe(
        '/boston-health-care/events/76044'
      )
    })
  })
})
