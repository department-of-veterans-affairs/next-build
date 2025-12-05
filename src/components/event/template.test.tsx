import React from 'react'
import { render, screen } from '@testing-library/react'
import { Event } from './template'
import { Event as FormattedEvent } from './formatted-type'
import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { axe } from '@/test-utils'

jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

// Helper to create minimal default props
const createMockEvent = (
  overrides: Partial<FormattedEvent> = {}
): FormattedEvent => ({
  id: '',
  type: '',
  published: false,
  lastUpdated: '',
  title: '',
  date: '',
  locationType: '',
  description: '',
  cost: '',
  registrationRequired: false,
  listing: '',
  listingOffice: '',
  locationHumanReadable: '',
  administration: { entityId: 0, name: '' },
  image: null,
  socialLinks: null,
  additionalInfo: '',
  // Provide empty address object to prevent addressToString from crashing
  address: {
    langcode: 'en',
    country_code: '',
    administrative_area: '',
    locality: '',
  },
  eventCTA: null,
  emailCTA: null,
  howToSignUp: null,
  datetimeRange: null,
  body: '',
  link: null,
  urlOfOnlineEvent: null,
  facilityLocation: null,
  ...overrides,
})

// Minimal facility location mock - only fields actually used in component
const createMockFacilityLocation = (
  overrides = {}
): NodeHealthCareLocalFacility =>
  ({
    title: 'Aberdeen VA Clinic',
    path: { alias: '/facility' },
    field_address: {
      address_line1: '3307 10th Avenue Southeast',
      locality: 'Aberdeen',
      administrative_area: 'SD',
      country_code: 'US',
      postal_code: '57401-8027',
    },
    ...overrides,
  }) as NodeHealthCareLocalFacility

describe('<Event /> Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('gives no axe violations', async () => {
    const { container } = render(<Event {...createMockEvent()} />)
    const axeResults = await axe(container, {
      rules: {
        // It's only empty because it isn't evaluating the `<va-link>` element inside it.
        'empty-heading': { enabled: false },
      },
    })
    expect(axeResults).toHaveNoViolations()
  })

  it('renders event details correctly', () => {
    render(
      <Event
        {...createMockEvent({
          title: 'Test Event',
          description: 'Test Description',
          locationHumanReadable: 'Test Location',
          cost: '$10',
          body: '<p>Event Body</p>',
          datetimeRange: [
            {
              value: '2024-03-22T10:00:00',
              end_value: '2024-03-22T12:00:00',
              duration: 200,
              rrule: 1,
              rrule_index: 1,
              timezone: '',
            },
          ],
        })}
      />
    )

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Location')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
    expect(screen.getByText('Event Body')).toBeInTheDocument()
  })

  it('renders online event information correctly', () => {
    render(
      <Event
        {...createMockEvent({
          locationType: 'online',
          urlOfOnlineEvent: {
            uri: '/online-event',
            title: 'online',
            options: [],
          },
        })}
      />
    )

    const linkElement = document.querySelector(
      '[data-test-id="online-event-link"]'
    )
    expect(linkElement).toBeInTheDocument()
  })

  it('renders address', () => {
    render(
      <Event
        {...createMockEvent({
          facilityLocation: createMockFacilityLocation(),
        })}
      />
    )
    expect(screen.getByText('3307 10th Avenue Southeast')).toBeInTheDocument()
  })

  describe('va-links in paragraph tags', () => {
    it('always wraps outreach link in paragraph tag', () => {
      render(<Event {...createMockEvent()} />)
      const outreachLink = document.querySelector(
        'va-link[href="/outreach-and-events/events/"]'
      )
      expect(outreachLink).not.toBeNull()
      expect(outreachLink?.parentElement?.tagName.toLowerCase()).toBe('p')
    })

    it('wraps administration link in paragraph tag when present', () => {
      render(
        <Event
          {...createMockEvent({
            administration: {
              entityId: 1,
              name: 'Test Administration',
            },
            listing: '/test-listing',
            listingOffice: 'Test Office',
          })}
        />
      )
      const seeMoreLink = document.querySelector(
        'va-link[id="see-more-events"]'
      )
      expect(seeMoreLink).not.toBeNull()
      expect(seeMoreLink?.parentElement?.tagName.toLowerCase()).toBe('p')
    })
  })
})
