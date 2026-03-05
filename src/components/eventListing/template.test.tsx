import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { EventListing } from './template'
import { EventWidgetTeaser } from '@/components/eventTeaser/formatted-type'
import { formatDateObject } from '@/lib/utils/date'
import { EventListing as FormattedEventListing } from './formatted-type'

declare global {
  interface Window {
    allEventTeasers?: {
      entities: EventWidgetTeaser[]
    }
  }
}

const baseProps: FormattedEventListing = {
  id: 'test-id',
  type: 'node--event_listing',
  published: true,
  lastUpdated: '2024-01-01T00:00:00+00:00',
  title: 'Events',
  introText: 'Test intro',
  events: [],
  menu: undefined,
  lovellVariant: null,
  lovellSwitchPath: null,
  totalItems: 0,
  totalPages: 1,
}

const mockEvent: EventWidgetTeaser = {
  changed: '2025-01-07T16:59:47+00:00',
  entityBundle: 'node--event',
  entityId: 'd6593609-8836-4ee6-9c6b-4645a179839e',
  entityPublished: true,
  entityUrl: {
    path: '/test-event-path',
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
  fieldDatetimeRangeTimezone: formatDateObject([
    {
      value: '2045-08-14T18:00:00+00:00',
      end_value: '2045-08-14T19:00:00+00:00',
      duration: 60,
      rrule: null,
      rrule_index: null,
      timezone: 'America/Chicago',
    },
  ]),
  fieldDescription: 'Test event description',
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
  title: 'Test Event',
}

describe('EventListing', () => {
  beforeEach(() => {
    delete window.allEventTeasers
  })

  describe('allEventTeasers global variable', () => {
    it('populates window.allEventTeasers with the events passed to the component', () => {
      const events = [mockEvent]
      render(<EventListing {...baseProps} events={events} totalItems={1} />)

      expect(window.allEventTeasers).toEqual({ entities: events })
    })
  })

  describe('rendered HTML elements', () => {
    it('renders the title in an h1 element', () => {
      render(<EventListing {...baseProps} title="Test Events Page" />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Events Page')
      expect(heading).toHaveAttribute('id', 'article-heading')
    })

    it('renders introText when provided', () => {
      render(<EventListing {...baseProps} introText="This is the intro text" />)

      expect(screen.getByText('This is the intro text')).toBeInTheDocument()
    })

    it('does not render introText paragraph when introText is not provided', () => {
      render(<EventListing {...baseProps} introText={null} />)

      const introTextDiv = document.querySelector('.va-introtext')
      expect(introTextDiv?.textContent).toBe('')
    })

    it('renders the events widget container', () => {
      const { container } = render(<EventListing {...baseProps} />)

      const widgetContainer = container.querySelector(
        '[data-widget-type="events"]'
      )
      expect(widgetContainer).toBeInTheDocument()
    })

    it('has no accessibility violations', async () => {
      const { container } = render(<EventListing {...baseProps} />)

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })
  })

  describe('LovellSwitcher rendering', () => {
    it('renders va-alert when lovellVariant and lovellSwitchPath are provided', () => {
      const { container } = render(
        <EventListing
          {...baseProps}
          lovellVariant="tricare"
          lovellSwitchPath="/lovell-federal-health-care-va/events"
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('status', 'warning')
      expect(alert).toHaveAttribute('id', 'va-info-alert')
    })

    it('does not render va-alert when lovellVariant is null', () => {
      const { container } = render(
        <EventListing
          {...baseProps}
          lovellVariant={null}
          lovellSwitchPath="/lovell-federal-health-care-va/events"
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).not.toBeInTheDocument()
    })

    it('does not render va-alert when lovellSwitchPath is null', () => {
      const { container } = render(
        <EventListing
          {...baseProps}
          lovellVariant="tricare"
          lovellSwitchPath={null}
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).not.toBeInTheDocument()
    })
  })
})
