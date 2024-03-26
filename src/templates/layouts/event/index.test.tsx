import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Event } from './'
import { recordEvent } from '@/lib/analytics/recordEvent'

jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

describe('<Event /> Component', () => {
  const eventProps = {
    title: 'Test Event',
    description: 'Test Description',
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
    locationHumanReadable: 'Test Location',
    address: {
      address_line1: '123 Test St',
      locality: 'Test City',
      administrative_area: 'Test State',
      langcode: 'en',
      country_code: '123',
      address_line2: '',
    },
    cost: '$10',
    socialLinks: {
      title: 'test links',
      path: '/social-links',
    },
    link: {
      url: { path: '/event-link' },
    },
    urlOfOnlineEvent: {
      uri: '/online-event',
      title: 'online',
      options: [],
    },
    listing: '/more-events',
    additionalInfo: {
      processed: '<p>Additional Info</p>',
      value: '<p>Additional Info</p>',
      format: 'text',
    },
    eventCTA: 'Register Now',
    emailCTA: 'Register via Email',
    howToSignUp: 'email',
    body: {
      processed: '<p>Event Body</p>',
      value: '<p>Event Body</p>',
      format: 'text',
    },
  }

  beforeEach(() => {
    render(
      <Event
        id={''}
        type={''}
        published={false}
        lastUpdated={''}
        image={{
          id: '',
          alt: '',
          title: '',
          width: 0,
          height: 0,
          links: {},
        }}
        date={''}
        facilityLocation={undefined}
        locationType={''}
        {...eventProps}
      />
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders event details correctly', () => {
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Location')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
    expect(screen.getByText('Event Body')).toBeInTheDocument()
  })

  it('triggers recordEvent function when "See more events" link is clicked', () => {
    fireEvent.click(screen.getByText('See more events'))
    expect(recordEvent).toHaveBeenCalledTimes(1)
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'nav-secondary-button-click',
    })
  })
})
